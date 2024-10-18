import { commands, window } from "vscode";
import { asNotify } from "@jsonrpc-rx/server";
import { MessageService } from "../service/message.service";
import { Deferred } from "../util/deferred";
import { BroswerService } from "../service/broswer.service";

const messageService = new MessageService();
const broswerService = new BroswerService();

export const getHandlers = () => {
  return {
    // showMessage
    ...{
      showInformation: asNotify((message: string) => {
        window.showInformationMessage(message);
      }),
    },
    // 通信
    ...{
      registerChannel: (channel: string, listener: (value: any) => void) => {
        messageService.register(channel, listener);
      },
      unregisterChannel: (channel: string) => {
        messageService.unregister(channel);
      },
      sendMessage: (channel: string, value: any) => {
        return messageService.send(channel, value);
      },
    },
    // 指令执行
    ...{
      execCommand: (command: string, ...rest: any[]) => {
        const { promise, reject, resolve } = new Deferred<any>();
        commands.executeCommand(command, ...rest).then(resolve, reject);
        return promise;
      },
    },
    ...{
      openBroswer(options: { url: string }) {
        broswerService.openNew(options);
      },
    },
  };
};

export type HandlersType = ReturnType<typeof getHandlers>;
