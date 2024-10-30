const ConfirmationModal = ({ onClose, onConfirm, message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-96 space-y-6 shadow-xl transform transition-transform duration-300 scale-100 hover:scale-105">
        <h2 className="text-gray-900 text-xl font-semibold">{message}</h2>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg border border-gray-400 hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
