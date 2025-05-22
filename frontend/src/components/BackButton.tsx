import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/products");
    }
  };

  return (
    <button className="text-lg text-left mb-4 font-inter hover:underline" onClick={handleBack}>
      &larr; Back
    </button>
  );
}

export default BackButton;
