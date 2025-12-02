import React, { useState } from 'react';
import api from '../../services/api'; 
import '../../style/PDFBotao.css';

interface PdfButtonProps {
  url: string;
  label: string;
  filename?: string;
}

const PdfButton: React.FC<PdfButtonProps> = ({ url, label, filename = 'relatorio.pdf' }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erro PDF:", error);
      alert("Erro ao baixar PDF. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className={`pdf-btn ${loading ? 'disabled' : ''}`} onClick={handleClick} disabled={loading}>
      {loading ? 'Gerando...' : label}
    </button>
  );
};
export default PdfButton;