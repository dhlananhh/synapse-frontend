interface ResourceTypeSelectorProps {
  resourceTypes: { label: string; value: string }[];
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function ResourceTypeSelector({
  resourceTypes,
  selectedType,
  onTypeChange,
}: ResourceTypeSelectorProps) {
  return (
    <div className="mb-6 flex items-center">
      {resourceTypes.map((rt, idx) =>
        selectedType === rt.value ? (
          <button
            key={rt.value}
            className="bg-primary/20 border-primary rounded-full border-2 px-4 py-2 font-medium text-white shadow transition"
            style={{
              boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
              marginRight:
                idx !== resourceTypes.length - 1
                  ? "4rem"
                  : undefined, // Add more space between items
            }}
            disabled
          >
            {rt.label}
          </button>
        ) : (
          <span
            key={rt.value}
            className="text-foreground hover:text-primary cursor-pointer font-medium transition"
            style={{
              marginRight:
                idx !== resourceTypes.length - 1
                  ? "4rem"
                  : undefined, // Add more space between items
            }}
            onClick={() => onTypeChange(rt.value)}
          >
            {rt.label}
          </span>
        )
      )}
    </div>
  );
}
