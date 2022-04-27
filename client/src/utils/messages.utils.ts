export const scrollToBottom = (isSmooth = true) => {
  setTimeout(() => {
    const chat = document.getElementById("messageBody");
    if (chat) {
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: isSmooth ? "smooth" : "auto",
      });
    }
  });
};

export const getFormattedTime = (time: string) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${(hours < 10 ? "0" : "") + hours}:${
    (minutes < 10 ? "0" : "") + minutes
  }`;
};

// get extension of file and check if it's image
export const isImage = (filename: string) => {
  const ext = filename.split(".").pop();
  return ext && /(jpg|jpeg|png|gif)$/i.test(ext);
};

export const getFileName = (fileloc: string) => {
  return fileloc.split("/").pop();
};
