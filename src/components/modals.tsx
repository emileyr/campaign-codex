import { useRef } from "react";
import { createPortal } from "react-dom";
import { mainHtmlId } from "~/pages/_app";

type ModalProps = {
  render: boolean;
  setRender: (render: boolean) => void;
  container?: Element | DocumentFragment;
  children?: React.ReactNode;
};

const { document } = global;
export const Modal = ({
  render,
  setRender,
  container = document?.getElementById(mainHtmlId) ?? document?.body,
  children = <></>,
}: ModalProps) => {
  const ref = useRef<any>();
  if (!render) return <></>;
  return createPortal(
    <div
      ref={ref}
      className="fixed inset-0 grid grid-cols-1 place-items-center content-center gap-8 bg-black bg-opacity-70"
      onClick={({ target }) =>
        target === ref.current ? setRender(false) : void undefined
      }
    >
      {children}
    </div>,
    container
  );
};
