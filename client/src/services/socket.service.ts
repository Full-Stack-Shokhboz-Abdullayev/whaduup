import { io } from "socket.io-client";
import SocketIOFileUpload from "socketio-file-upload";
import { SOCKET_URL } from "../constants/env-vars";

export const socket = io(SOCKET_URL);
export const uploader: any = new SocketIOFileUpload(socket);

export const destroyUploader = () => {
  try {
    uploader.destroy();
  } catch {
    return;
  }
};
