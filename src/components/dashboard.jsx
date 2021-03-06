import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import NavBar from "./navbar";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import { Formik, useFormik } from "formik";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SYNCUSERDATA } from "../redux/action";

import TextField from "@material-ui/core/TextField";
const Main = styled.div`
  min-height: 95vh;
  background-color: #f1f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
`;
const DashboardHeader = styled.div`
  height: 100px;
  width: 98%;
  background-color: #ffff;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const RefferHeader = styled.div`
  height: 80px;
  margin-top: 10px;
  width: 98%;
  background-color: #ffff;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const GiftHeader = styled.div`
  min-height: 90px;
  margin-top: 10px;
  width: 98%;
  background-color: #ffff;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;
const ReferralContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 98%;
  flex-wrap: wrap;
  padding: 10px;
  background-color: white;
  margin: 10px;
  margin-top: 0px;
  min-height: 160px;
  justify-content: center;
`;
const BigText = styled.p`
  color: grey;
  font-size: 20px;
`;
const MediumText = styled.p`
  color: grey;
  font-size: 14px;
  font-weight: 700;
`;
const MediumTextLignt = styled.p`
  color: grey;
  font-size: 14px;
`;
const SmallText = styled.p`
  color: #f0fff0;
  font-size: 14px;
  font-weight: 700;
  font-family: boxicons !important;
`;
const SmallText2 = styled.p`
  color: #f0fff0;
  font-size: 12px;
  font-weight: 700;
  font-family: boxicons !important;
`;
const Margin = styled.div`
  height: 100px;
`;

const ModalStyle = {
  minWidth: "300px",
  minHeight: "400px",
  backgroundColor: "white",
  border: "2px solid #000",
  position: "absolute",
  padding: "4px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "20px",
  borderRadius: "10px",
};

const CardsContainer = styled.div`
  width: 200px;
  height: 160px;
  background-color: ${({ color }) => color || "grey"};
  border-radius: 10px;
  margin: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;
  overflow-wrap: break-word;
  word-wrap: break-word;

  padding: 4px;
`;
const ReferralCards = (props) => {
  const { Email, fullName } = props.data;
  return (
    <CardsContainer color={props.color}>
      <div>
        <SmallText2>Name: {fullName}</SmallText2>
        <SmallText2>Email: {Email}</SmallText2>
      </div>
    </CardsContainer>
  );
};
const DownlinersCards = (props) => {
  const { Email, fullName, paymentStatus, _id, evidenImageUri } = props.data;

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <CardsContainer color={paymentStatus ? "#25D366" : props.color}>
      <div>
        <SmallText2>Name: {fullName}</SmallText2>
        <SmallText2>Email: {Email}</SmallText2>
      </div>
      {evidenImageUri ? (
        <img
          onClick={() => {
            openInNewTab(evidenImageUri);
          }}
          style={{ alignSelf: "center", width: "90px", height: "80px" }}
          src={evidenImageUri}
          alt="evidence img"
        />
      ) : null}

      <Button
        disabled={paymentStatus}
        color="primary"
        style={{ height: "18px" }}
        variant="contained"
        onClick={() => {
          props.handleReceived(_id);
        }}
      >
        <p style={{ fontSize: "10px", color: "white" }}>
          {paymentStatus ? "Gift Received" : "confirm received"}
        </p>
      </Button>
    </CardsContainer>
  );
};
// const DownLinerCards = (props) => {
//   return (
//     <CardsContainer color={props.color}>
//       <SmallText>Name: sarrah mohammed</SmallText>
//       <SmallText>Email: microsoft90@yahoo.com</SmallText>
//       <SmallText>Introduced by: sarray mohhamed</SmallText>
//     </CardsContainer>
//   );
// };

const DashBoard = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = currentUser && currentUser.token;
  const userdata =
    (currentUser && currentUser.token && currentUser.userdata) || {};
  const colors = ["tomato", "#4c8bf5", "#5851db", "orange"];
  const dispatch = useDispatch();

  //   console.log(userdata.referrals);
  const [UpdateLoading, setUpdateLoading] = useState(false);
  const [ImageState, setImageState] = useState({ file: null, Uri: null });
  const [uploadingImg, setUploadingImg] = useState(false);
  const handleReceived = (payerId) => {
    axios
      .post(
        "/users/ConfirmPaymentReceived",
        { payerId: payerId },
        { headers: { authorization: token } }
      )
      .then((res) => {
        dispatch(SYNCUSERDATA(res.data.userdata));
      });
  };

  function handleChange(event) {
    setImageState({
      file: URL.createObjectURL(event.target.files[0]),
      Uri: event.target.files[0],
    });
  }

  useEffect(() => {
    axios
      .get(
        "/users/updateClient",
        // "https://tranquil-headland-58367.herokuapp.com/users/updateClient",
        {
          headers: { authorization: token },
        }
      )
      .then((res) => {
        dispatch(SYNCUSERDATA(res.data.userdata));
        console.log("updated");
      });
  }, []);
  const MapReferrs = () => {
    return userdata.referrals.length > 0 ? (
      userdata.referrals.map((data) => {
        return <ReferralCards color="#4c8bf5" data={data} />;
      })
    ) : (
      <MediumTextLignt>
        Introduce 2 friends and family members with your referral code..
      </MediumTextLignt>
    );
  };
  const MapDownLiners = () => {
    return userdata.downLiners.length > 0 ? (
      userdata.downLiners.map((data) => {
        return (
          <DownlinersCards
            handleReceived={handleReceived}
            color="tomato"
            data={data}
          />
        );
      })
    ) : (
      <MediumText>Not yet A gifted..</MediumText>
    );
  };

  //   const MapDownLiners = () => {
  //     console.log(userdata);
  //     return userdata.downLiners.length > 1 ? (
  //       userdata.downLiners.map((data) => {
  //         return <DownLinerCards color="#4c8bf5" data={data} />;
  //       })
  //     ) : (
  //       <MediumText>No Referrals yet..</MediumText>
  //     );
  //   };
  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpenUpload = () => {
    setOpenUpload(true);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //   const handleUpdateAcct = () => {
  //       axios.post("http://127.0.0.1:8080/users/UpdateMyAcctNumber",)
  //     // setOpen(false);
  //   };
  const formik = useFormik({
    initialValues: {
      bank_Name: userdata.bank_Name,
      bank_Acct_Number: userdata.bank_Acct_Number,
    },
    validationSchema: null,
    onSubmit: (values) => {
      setUpdateLoading(true);

      axios
        .post(
          "/users/UpdateMyAcctNumber",
          //   "https://tranquil-headland-58367.herokuapp.com/users/UpdateMyAcctNumber",
          values,
          {
            headers: { authorization: token },
          }
        )
        .then((res) => {
          console.log(res.data);
          dispatch(SYNCUSERDATA(res.data.userdata));
          setUpdateLoading(false);
          handleClose();
        })
        .catch((err) => {
          setUpdateLoading(false);
          handleClose();
          console.log(err);
        });
    },
  });

  const handleUploadImg = async () => {
    const image = ImageState.Uri;
    const pay_to__id = userdata.pay_to__id;

    if (!image) {
      alert("no image");
      return;
    } else {
      setUploadingImg(true);
      //   console.log("image seen", image);
      var formData = new FormData();
      formData.append(
        "file",
        //  {
        //   uri: image,
        //   type: "image/jpeg",
        //   name: "image.jpg",
        // }
        image
      );
      formData.append("pay_to__id", pay_to__id);
      axios({
        url: "/users/UploadImg",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
        .then((res) => {
          console.log(res.data);
          setUploadingImg(false);
          alert(res.data.response);
          //   dispatch(upDateUserSUcess(res.data));
        })
        .catch((error) => {
          if (error.response) {
            setUploadingImg(false);
            // dispatch(upDateUserFailure(error.data));
            // console.log(error.response.data);
            alert(error.response.data.message);
            console.log(error.response.data.message);
          } else {
            // upDateUserFailure({ message: "error" });
            // console.log(error);
            console.log(error);
            setUploadingImg(false);
          }
        });
    }
  };

  const body = (
    <div style={{ ...modalStyle, ...ModalStyle }}>
      <MediumTextLignt>Update Bank Account </MediumTextLignt>
      <div style={{ width: "60%", textAlign: "center" }}>
        <TextField
          value={formik.values.bank_Name}
          id="bank_n"
          bank_Name
          size={30}
          name="bank_Name"
          label="Bank Name"
          onChange={formik.handleChange}
          onSubmit={formik.handleSubmit}
        />
        <TextField
          defaultValue={userdata.bank_Acct_Number}
          type="number"
          onInput={(e) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 12);
          }}
          label="Account Number"
          id="bank_Acct_Number"
          name="bank_Acct_Number"
          value={formik.values.bank_Acct_Number}
          onChange={formik.handleChange}
          onSubmit={formik.handleSubmit}
        />
      </div>

      <Button
        color="primary"
        style={{ height: "18px" }}
        variant="contained"
        onClick={formik.handleSubmit}
      >
        {UpdateLoading ? (
          <CircularProgress
            size={10}
            color="primary"
            style={{ color: "white" }}
          />
        ) : (
          <small> update</small>
        )}
      </Button>
    </div>
  );
  const body2 = (
    <div style={{ ...modalStyle, ...ModalStyle }}>
      <MediumTextLignt>Upload Payment Evidence </MediumTextLignt>
      {uploadingImg ? (
        <>
          <CircularProgress
            size={50}
            color="primary"
            style={{ color: "red" }}
          />
          <small>uploading...</small>
        </>
      ) : (
        <div style={{ width: "60%", textAlign: "center" }}>
          {ImageState.file && (
            <img
              src={ImageState.file}
              alt="preview"
              style={{ maxHeight: "200px", maxWidth: "160px" }}
            />
          )}
          <Button variant="contained" component="label">
            Select
            <input type="file" hidden onChange={handleChange} />
          </Button>
        </div>
      )}

      <Button
        color="primary"
        style={{ height: "18px" }}
        variant="contained"
        onClick={handleUploadImg}
      >
        {UpdateLoading ? (
          <CircularProgress
            size={10}
            color="primary"
            style={{ color: "white" }}
          />
        ) : (
          <small style={{ fontSize: 9 }}>
            {" "}
            upload and request for confirmation
          </small>
        )}
      </Button>
    </div>
  );

  return (
    <div>
      <NavBar />
      <Main>
        <Margin />
        <DashboardHeader>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
          <Modal
            open={openUpload}
            onClose={handleCloseUpload}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body2}
          </Modal>
          <div>
            <MediumTextLignt>
              {userdata.fullName} - ({userdata.Email})
            </MediumTextLignt>
            <MediumTextLignt>
              My Referral Code- <b>{userdata.referralCode}</b>
            </MediumTextLignt>
            <MediumTextLignt>
              My Membership Status-{" "}
              {userdata.downLiners && userdata.downLiners.length > 0
                ? "water position (Gifted)"
                : userdata.referrals.length && userdata.downLiners.length > 1
                ? "wind position"
                : "Fire Position"}
              {/* userdata.referrals.length 
userdata.downLiners */}
              {/* My Membership Status- <b>wind Position</b>
              My Membership Status- <b>water Position</b> */}
              {/* water position(gifted)--is if you have brought two people who brough 2
              wind position--is if you bring one position
              fire position is if you have not brought anybody */}
            </MediumTextLignt>
          </div>
          <BigText>Dashboard</BigText>
        </DashboardHeader>
        <GiftHeader>
          <div>
            <MediumTextLignt>
              <b>My Details</b>
            </MediumTextLignt>
            <MediumTextLignt>Bank Name - {userdata.bank_Name}</MediumTextLignt>
            <MediumTextLignt>
              My Accouunt Number - {userdata.bank_Acct_Number}
            </MediumTextLignt>
            <MediumTextLignt>
              Account Name - {userdata.fullName}
            </MediumTextLignt>
            <MediumTextLignt>
              <small style={{ color: "tomato", fontSize: "12px" }}>
                **ensure bank account is correct before reffering a friend
              </small>
            </MediumTextLignt>

            <Button
              color="primary"
              style={{ height: "18px" }}
              variant="contained"
              onClick={handleOpen}
            >
              <small style={{ fontSize: 10 }}> update</small>
            </Button>
          </div>
          <div>
            <MediumTextLignt>
              <b> Send Gift</b>
            </MediumTextLignt>
            <MediumTextLignt>
              Gifted member to be paid by me --{" "}
              <b>{userdata.pay_to_BankUserName}</b>
            </MediumTextLignt>
            <MediumTextLignt>
              Bank Name to be paid by me -- <b>{userdata.pay_to_BankName}</b>
            </MediumTextLignt>
            <MediumTextLignt>
              Account to send gift to- <b>{userdata.pay_to_BankNumber}</b>
            </MediumTextLignt>
            <MediumTextLignt>
              Payment Status--
              {userdata.pay_to_BankNumber && userdata.paymentConfirmed ? (
                <b style={{ color: "green" }}>Confirmed</b>
              ) : (
                <b style={{ color: "red" }}>pending</b>
              )}
              {/* <CloseIcon fontSize="small" style={{ color: "red" }} /> */}
              {/* <CheckIcon fontSize="small" style={{ color: "green" }} /> */}
            </MediumTextLignt>
            <Button
              color="primary"
              style={{ height: "18px" }}
              variant="contained"
              onClick={handleOpenUpload}
              disabled={
                !userdata.pay_to_BankNumber || userdata.paymentConfirmed
              }
            >
              <small style={{ fontSize: 10 }}> Upload Payment Evidence</small>
            </Button>
          </div>
        </GiftHeader>
        <RefferHeader>
          <BigText>Level One - ({userdata.referrals.length})</BigText>
        </RefferHeader>
        <ReferralContainer>
          {/* <ReferralCards color="#4c8bf5" />
          <ReferralCards color="#4c8bf5" /> */}

          {MapReferrs()}
        </ReferralContainer>
        <RefferHeader>
          <BigText>
            level Two (Gift Givers) ({userdata.downLiners.length})
          </BigText>
        </RefferHeader>
        <ReferralContainer>{MapDownLiners()}</ReferralContainer>
      </Main>
      <Footer />
    </div>
  );
};

export default DashBoard;
