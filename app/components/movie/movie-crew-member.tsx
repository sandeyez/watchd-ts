type MovieCrewMemberProps = {
  name: string;
  heading: string;
};

export function MovieCrewMember({ name, heading }: MovieCrewMemberProps) {
  return (
    <div className="flex justify-between items-center gap-3">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-muted-foreground">
          {heading}
        </span>
        <span className="text-sm text-muted-foreground">{name}</span>
      </div>
    </div>
  );
}
