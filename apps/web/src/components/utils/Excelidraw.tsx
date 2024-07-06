const ExcalidrawEmbed = ({
  isOpen,
  onClose,
  isMaximized,
  onToggleMaximize,
  leftWidth,
}: {
  isOpen: Boolean;
  onClose: () => void;
  isMaximized: Boolean;
  onToggleMaximize: () => void;
  leftWidth: Number;
}) => {
  if (!isOpen) return null;

  const style = isMaximized
    ? { width: "100%", height: "calc(100% - 48px)" }
    : { width: `${leftWidth}%`, height: "70%" };

  return (
    <div
      className="absolute bottom-12 left-0 bg-card rounded-t-lg shadow-lg overflow-hidden"
      style={style}
    >
      <div className="flex justify-between items-center p-2 bg-secondary">
        <h3 className="text-secondary-foreground">Excalidraw</h3>
        <div>
          <button
            onClick={onToggleMaximize}
            className="mr-2 text-secondary-foreground hover:text-primary"
          >
            {isMaximized ? "🗗" : "🗖"}
          </button>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-destructive"
          >
            ✕
          </button>
        </div>
      </div>
      <iframe
        src="https://excalidraw.com/"
        style={{ width: "100%", height: "calc(100% - 40px)" }}
        allow="clipboard-write"
      ></iframe>
    </div>
  );
};

export default ExcalidrawEmbed;
