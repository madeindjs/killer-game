import QRCodeSvg from "qrcode-svg";

export default function QRCode({ content }) {
  const code = new QRCodeSvg(content).svg();

  return <div dangerouslySetInnerHTML={code}></div>;
}
