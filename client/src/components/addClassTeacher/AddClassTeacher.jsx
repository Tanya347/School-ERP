import { useState } from "react";
import { toast } from "react-toastify";

import Popup from "../shared/popup/Popup";
import Dropdown from "../shared/dropdown/Dropdown";

import { addClassTeacher } from "../../utils/endpoints/put";
import { somethingWentWrongMsg } from "../../utils/shared/constants";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { checkSuccess } from "../../utils/shared/commons";

const AddClassTeacher = ({ sclass, teacherList, setOpen }) => {
  const [teacher, setTeacher] = useState("");

  const handleAdd = async () => {
    try {
      const res = await axiosInterceptor.put(
        addClassTeacher(sclass),
        { teacher }
      );

      if (checkSuccess(res.data.status)) {
        window.location.reload();
      }

      setOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || somethingWentWrongMsg
      );
    }
  };

  return (
    <Popup
      title="Add Class Teacher"
      onClose={() => setOpen(false)}
      content={
        <Dropdown
          title="Select Teacher"
          value={teacher}
          options={teacherList}
          onChange={(e) => setTeacher(e.target.value)}
        />
      }
      actions={[
        {
          label: "Add Class Teacher",
          onClick: handleAdd,
          disabled: !teacher,
        },
      ]}
    />
  );
};

export default AddClassTeacher;