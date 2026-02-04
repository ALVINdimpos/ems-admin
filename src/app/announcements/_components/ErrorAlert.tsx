interface IErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: IErrorAlertProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
      <p className="text-red-400">{message}</p>
    </div>
  );
}
