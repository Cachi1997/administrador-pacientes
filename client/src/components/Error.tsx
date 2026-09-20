const Error = ({ children }: { children: React.ReactNode }) => {
  return (
    <p
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-sm text-danger"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
};

export default Error;
