import { useState } from "react";
import { toast } from "react-toastify";

import Popup from "../shared/popup/Popup";

import { forgotPaswordURL } from "../../utils/endpoints/post";
import { somethingWentWrongMsg } from "../../utils/shared/constants";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { checkSuccess } from "../../utils/shared/commons";

const ForgotPassword = ({ setOpen, type }) => {
  const [email, setEmail] = useState("");

  const handleGenerate = async () => {
    try {
      const res = await axiosInterceptor.post(
        forgotPaswordURL(type),
        { email }
      );

      if (checkSuccess(res.data.status)) {
        toast.success(
          "Reset password link sent to your email!"
        );
      }

      setOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          somethingWentWrongMsg
      );
    }
  };

  return (
    <Popup
      title="Please enter your email"
      onClose={() => setOpen(false)}
      content={
        <input
          className="popup-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      }
      actions={[
        {
          label: "Generate Reset Link",
          onClick: handleGenerate,
          disabled: !email,
        },
      ]}
    />
  );
};

export default ForgotPassword;
