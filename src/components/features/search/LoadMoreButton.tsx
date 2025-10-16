interface LoadMoreButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function LoadMoreButton({
  loading,
  onClick,
}: LoadMoreButtonProps) {
  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 font-medium text-white shadow transition"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
