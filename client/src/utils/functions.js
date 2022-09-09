export const defaultFilter=(array,userTeam)=>{
  return array.filter(
    (item) =>
      item.status !== "Close" &&
      (item.team === userTeam ||
        userTeam === "Customer service")
  )
}

export const teamFilter=(array,userTeam)=>{
  return array.filter(
    (item) =>
      (item.team === userTeam ||
        userTeam === "Customer service")
  )
}

export const clientIdHandler = (e, setClient, props) => {
  let value = e.target.value;
  setClient((prevState) => {
    return { ...prevState, id: value, idIsValid: false };
  });
  if (value.length === 9) {
    //need to add if in the id is match
    let [user] = props.clients.filter((user) => user.id === parseInt(value));
    if (user) {
      setClient((prevState) => {
        return {
          ...prevState,
          name: user.name,
          surname: user.surname,
          phone:user.phoneNumber,
          idIsValid: true,
        };
      });
    }
  }
};

export const teamMemberIdHandler = (e, team, setTeamMember, props) => {
  let value = e.target.value;
  setTeamMember((prevState) => {
    return { ...prevState, id: value, idIsValid: false };
  });
  if (value.length === 9) {
    //need to add if in the id is match
    let [user] = props.users.filter(
      (user) => user.team === team && user.id === parseInt(value)
    );
    if (user) {
      setTeamMember((prevState) => {
        return {
          ...prevState,
          name: user.name,
          surname: user.surname,
          idIsValid: true,
        };
      });
    }
  }
};

export const teamHandler = (e, set, setTeamMember) => {
  set((prevState) => {
    return { ...prevState, team: e.target.value };
  });
  setTeamMember((prevState) => {
    return { ...prevState, id: "", name: "", surname: "", idIsValid: false };
  });
};

export const urgencyHandler = (e, set) => {
  set((prevState) => {
    return { ...prevState, urgencyLevel: e.target.value };
  });
};

export const capitalizeFirstLetter = (word) => {
  // let words = sentence.split(" ");
  // sentence = words
  //   .map((word) => {
  //     return word[0].toUpperCase() + word.substring(1);
  //   })
  //   .join(" ");
  // return sentence;
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const displayDate = (dateFormat) => {
  let date = new Date(dateFormat);
  let month = date.getMonth() + 1;
  let displayDate = `${date.getFullYear()}-${
    month >= 10 ? month : "0" + month
  }-${date.getDate() >= 10 ? date.getDate() : "0" + date.getDate()} ${
    date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()
  }:${date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()}`;
  return displayDate;
};

export const getTimeDuration = (dateCreatedFormat) => {
  let createdDate = new Date(dateCreatedFormat);
  let currDate = new Date();
  let displayTimeDuration = "",
    paramsNum = 2,
    count = 0;
  let difference = currDate - createdDate; //milliseconds
  let weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
  if (weeks > 0 && count < paramsNum) {
    difference =
      (difference / (1000 * 60 * 60 * 24 * 7) -
        Math.floor(difference / (1000 * 60 * 60 * 24 * 7))) *
      (1000 * 60 * 60 * 24 * 7);
    count++;
    displayTimeDuration += ` ${weeks} weeks,`;
  }
  let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  if (days > 0 && count < paramsNum) {
    difference =
      (difference / (1000 * 60 * 60 * 24) -
        Math.floor(difference / (1000 * 60 * 60 * 24))) *
      (1000 * 60 * 60 * 24);
    count++;
    displayTimeDuration += ` ${days} days,`;
  }
  let hours = Math.floor(difference / (1000 * 60 * 60));
  if (hours > 0 && count < paramsNum) {
    difference =
      (difference / (1000 * 60 * 60) -
        Math.floor(difference / (1000 * 60 * 60))) *
      (1000 * 60 * 60);
    count++;
    displayTimeDuration += ` ${hours} hours,`;
  }
  let min = Math.floor(difference / (1000 * 60));
  if ((min > 0 && count < paramsNum) || count === 0) {
    difference =
      (difference / (1000 * 60) - Math.floor(difference / (1000 * 60))) *
      (1000 * 60);
    count++;
    displayTimeDuration += ` ${min} min,`;
  }

  return displayTimeDuration.slice(0, -1); //remove last character ','
};

let Activity = {
  user: "",
  id: "",
  action: "",
  data: "",
};

export const modifiedActivity = (
  authCtx,
  props,
  fault,
  client,
  teamMember,
  Activity
) => {
  Activity.date = new Date();
  Activity.user = `${capitalizeFirstLetter(
    authCtx.user.name
  )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
  Activity.id = authCtx.user.id.toString();
  Activity.action = "Modified";
  Activity.data += `\t`;
  if (client.id !== props.fault.clientID) {
    Activity.data += `-Client Fullname: ${capitalizeFirstLetter(
      client.name
    )} ${capitalizeFirstLetter(client.surname)}\n\t`;
    Activity.data += `-Client ID: ${client.id.toString()}\n\t`;
  }
  if (fault.status !== props.fault.status)
    Activity.data += `-Status: ${fault.status}\n\t`;
  if (fault.team !== props.fault.team)
    Activity.data += `-Handler Team: ${fault.team}\n\t`;
  if (
    teamMember.id !==
    (props.fault.teamMemberID == null
      ? ""
      : props.fault.teamMemberID.toString())
  ) {
    if (props.fault.teamMemberID === null) {
      Activity.data += `+Handler Team ID: ${teamMember.id}\n\t`;
      Activity.data += `+Handler Team Member: ${teamMember.name} ${teamMember.surname}\n\t`;
    } else if (teamMember.id === "") {
      Activity.data += `-Handler Team Member is been removed.\n\t`;
    } else {
      Activity.data += `-Handler Team ID: ${teamMember.id}\n\t`;
      Activity.data += `-Handler Team Member: ${teamMember.name} ${teamMember.surname}\n\t`;
    }
  }
  if (fault.urgencyLevel !== props.fault.urgencyLevel)
    Activity.data += `-Urgency level: ${fault.urgencyLevel}\n\t`;
  if (fault.description !== props.fault.description)
    Activity.data += `-Description: ${fault.description}\n\t`;
};

export const faultActivity = (authCtx, type, action) => {
  Activity.date = new Date();
  Activity.user = `${capitalizeFirstLetter(
    authCtx.user.name
  )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
  Activity.id = authCtx.user.id.toString();
  Activity.action = capitalizeFirstLetter(action);
  Activity.data += `\t-Status: ${capitalizeFirstLetter(action)}.\n\t`;
  Activity.data += `-The ${capitalizeFirstLetter(
    type
  )} has been ${action}.\n\t`;
  return Activity;
};

export const requestActivity = (authCtx, type, action) => {
  let requestActivity = {};
  requestActivity.date = new Date();
  requestActivity.user = `${capitalizeFirstLetter(
    authCtx.user.name
  )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
  requestActivity.id = authCtx.user.id.toString();
  requestActivity.action = capitalizeFirstLetter(action);
  requestActivity.data = `\t-Status: ${capitalizeFirstLetter(action)}.\n\t`;
  requestActivity.data += `-The ${capitalizeFirstLetter(
    type
  )} has been ${action}.\n\t`;
  let faultActivity = {};
  faultActivity.date = new Date();
  faultActivity.user = `${capitalizeFirstLetter(
    authCtx.user.name
  )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
  faultActivity.id = authCtx.user.id.toString();
  faultActivity.action = capitalizeFirstLetter(action);
  faultActivity.data = `\t-Status: In treatment.\n\t`;
  faultActivity.data += `-The ${capitalizeFirstLetter(
    type
  )} has been processed.\n\t`;
  return { requestActivity, faultActivity };
};

export const closePurchaseRequestActivity = (authCtx, type, action) => {
  let purchaseRequestActivity = {};
  purchaseRequestActivity.date = new Date();
  purchaseRequestActivity.user = `${capitalizeFirstLetter(
    authCtx.user.name
  )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
  purchaseRequestActivity.id = authCtx.user.id.toString();
  purchaseRequestActivity.action = "closed";
  purchaseRequestActivity.data = `\t-Status: ${capitalizeFirstLetter(
    action
  )}.\n\t`;
  purchaseRequestActivity.data += `-The Purchase Request has been closed.\n\t`;
  let requestActivity = {};
  requestActivity.date = new Date();
  requestActivity.user = `${capitalizeFirstLetter(
    authCtx.user.name
  )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
  requestActivity.id = authCtx.user.id.toString();
  requestActivity.action = "closed";
  requestActivity.data = `\t-Status: In treatment.\n\t`;
  requestActivity.data += `-The Purchase Request has been processed.\n\t`;
  return { purchaseRequestActivity, requestActivity };
};
