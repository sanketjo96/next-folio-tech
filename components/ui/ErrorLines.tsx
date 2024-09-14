export const ErrorLine = ({ message }: { message: string }) => (
  <p data-testid="error-line" className="ml-1 mt-2 text-sm text-rose-400">
    {message}
  </p>
);
