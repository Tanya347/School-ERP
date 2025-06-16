import { useState } from 'react';
import axios from 'axios';

const UploadMaterial = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [classId, setClassId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !classId) return alert('All required fields must be filled.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('classId', classId);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/materials`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Upload successful');
    } catch (err) {
      alert('Failed to upload the file.');
      console.error(err);
    }
  };

  const pictureUrl = "http://res.cloudinary.com/dnzkakna0/image/upload/v1749985839/upload/vbuyovahvlvfxiujjcqe.pdf"
  const previewImage = pictureUrl.replace('/upload/', '/upload/pg_1/w_400/');
  return (
    <>
      <form>
        <input type="text" placeholder="Material Name" onChange={e => setName(e.target.value)} required />
        <textarea placeholder="Description" onChange={e => setDesc(e.target.value)} />
        <input type="text" placeholder="Class ID" onChange={e => setClassId(e.target.value)} required />
        <input type="file" accept=".jpg,.png,.jpeg,.pdf" onChange={e => setFile(e.target.files[0])} required />
        <button onClick={handleSubmit} type="submit">Upload</button>
      </form>
      {/* <iframe
        src="https://res.cloudinary.com/dnzkakna0/raw/upload/v1750089859/erp_portal/klqycereb0aiojjpm2vn.pdf"
        width="100%"
        height="600px"
        title="PDF Preview"
      ></iframe> */}
    </>
  );
};

export default UploadMaterial;
