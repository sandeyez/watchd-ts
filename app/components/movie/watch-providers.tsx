import { useCountry } from "@/contexts/country-context";
import { getImageUrl } from "@/lib/tmdb-utils";
import { tmdb } from "@/lib/tmdb.server";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Buy, CountryCodes, Flatrate, Rent } from "tmdb-ts";
import z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useLocalStorageSettings } from "@/hooks/use-local-storage-settings";
import { cn } from "@/lib/tailwind";

type WatchProviderType = "flatrate" | "rent" | "buy";

const watchProviderTypeToDisplayNameMap: Record<WatchProviderType, string> = {
  flatrate: "Subscription",
  rent: "Rent",
  buy: "Buy",
};

const getWatchProviders = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      movieId: z.number(),
      countryCode: z.enum(CountryCodes),
    })
  )
  .handler(
    async ({
      data,
    }): Promise<Array<
      {
        type: WatchProviderType | WatchProviderType[];
      } & (Flatrate | Buy | Rent)
    > | null> => {
      const { movieId, countryCode } = data;

      const watchProviders = await tmdb.movies.watchProviders(movieId);

      const countryResults = watchProviders.results[countryCode];

      if (!countryResults) {
        return null;
      }

      return (
        Object.entries(countryResults)
          .filter(([_, value]) => Array.isArray(value))
          .flatMap(([key, value]) =>
            (value as any[]).map((provider) => ({
              ...provider,
              priority:
                "display_priority" in provider
                  ? provider.display_priority
                  : Infinity,
              type: key,
            }))
          ) as Array<
          {
            priority: number;
            type: WatchProviderType;
          } & (Flatrate | Buy | Rent)
        >
      )
        .sort((a, b) => a.priority - b.priority)
        .reduce<
          Array<
            {
              type: WatchProviderType | WatchProviderType[];
            } & (Flatrate | Buy | Rent)
          >
        >((acc, provider) => {
          const providerIndex = acc.findIndex(
            (p) => p.provider_id === provider.provider_id
          );

          if (providerIndex === -1) {
            return [...acc, provider];
          }

          acc[providerIndex] = {
            ...provider,
            type: Array.isArray(acc[providerIndex].type)
              ? [...acc[providerIndex].type, provider.type].sort()
              : [acc[providerIndex].type, provider.type].sort(),
          };

          return acc;
        }, []);
    }
  );

const TABS: Record<WatchProviderTab, string> = {
  ALL_PLATFORMS: "all",
  MY_PLATFORMS: "my",
};

export const watchProvidersTabs = ["ALL_PLATFORMS", "MY_PLATFORMS"] as const;
type WatchProviderTab = (typeof watchProvidersTabs)[number];

export function WatchProviders() {
  const { movieId: movieIdAsString } = useParams({
    from: "/_app/movies/$movieId/",
  });

  const movieId = Number(movieIdAsString);

  const { countryCode } = useCountry();

  const watchProviders = useQuery({
    queryKey: ["watchProviders", countryCode, movieId],
    queryFn: async () => {
      if (!countryCode) {
        return null;
      }
      const providers = await getWatchProviders({
        data: { movieId: movieId, countryCode },
      });
      return providers;
    },
  });

  const [defaultTab, setDefaultTab] = useLocalStorageSettings(
    "defaultSelectedWatchProvidertab"
  );

  return (
    <div className="space-y-3 @container/wp">
      <Tabs
        defaultValue={defaultTab}
        className="w-full"
        key={defaultTab}
        onValueChange={(value) =>
          // @ts-expect-error
          setDefaultTab(value)
        }
      >
        <TabsList className="w-full">
          <TabsTrigger value={TABS.MY_PLATFORMS}>My platforms</TabsTrigger>
          <TabsTrigger value={TABS.ALL_PLATFORMS}>All platforms</TabsTrigger>
        </TabsList>
        <TabsContent value={TABS.MY_PLATFORMS}>
          My platforms are not yet implemented
        </TabsContent>
        <TabsContent value={TABS.ALL_PLATFORMS}>
          {watchProviders.data ? (
            <ul className="grid grid-cols-1 @xs/wp:grid-cols-2 @lg/wp:grid-cols-3 @2xl/wp:grid-cols-4 gap-4">
              {watchProviders.data.map(
                ({ provider_name, provider_id, logo_path, type }) => (
                  <li
                    className={cn(
                      "flex items-center gap-2",
                      watchProviders.data?.length === 1 && "col-span-full"
                    )}
                    key={provider_id}
                  >
                    <div className="size-12 rounded-sm overflow-hidden ">
                      <img
                        src={
                          getImageUrl({
                            type: "logo",
                            size: "w154",
                            path: logo_path,
                          }) ?? ""
                        }
                      ></img>
                    </div>
                    <div className="flex flex-col">
                      <span key={provider_name} className="font-semibold">
                        {provider_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Array.isArray(type)
                          ? type
                              .map((t) => watchProviderTypeToDisplayNameMap[t])
                              .join("/")
                          : watchProviderTypeToDisplayNameMap[type]}
                      </span>
                    </div>
                  </li>
                )
              )}
            </ul>
          ) : (
            <span>We could not find streaming data for this movie.</span>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
