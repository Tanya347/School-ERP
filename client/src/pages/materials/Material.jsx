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
    let fileUrl;
    let publicId;
    if(file) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'upload');

      try {
        const uploadRes = await axios.post(
          `${process.env.REACT_APP_CLOUDINARY}?resource_type=raw`,
          data,
          { withCredentials: false }
        );
        fileUrl = uploadRes.data.url;
        publicId = uploadRes.data.public_id;
        console.log('File uploaded successfully:', file);
      }
      catch (err) {
        alert('Failed to upload the file. Please try again.');
        console.error(err);
        return;
      }
    }
    const newMaterial = {
      name,
      description: desc,
      classId,
      fileUrl: fileUrl,
      publicId: publicId
    }

    const res = await axios.post(process.env.REACT_APP_API_URL + '/materials', newMaterial, {
      withCredentials: true
    });

    console.log(res)

    alert('Upload successful');
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
      <iframe
        src="http://res.cloudinary.com/dnzkakna0/image/upload/v1749987142/upload/qwkdxeakdjwgd14vrm3d.pdf"
        width="100%"
        height="600px"
        title="PDF Preview"
      ></iframe>
    </>
  );
};

export default UploadMaterial;
