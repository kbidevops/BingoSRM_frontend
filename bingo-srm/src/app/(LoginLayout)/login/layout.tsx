import ClientProviders from "./ClientProviders";

// export const metadata = {
//     title: "로그인",
//     description: "보안 업무 산출물 관리 시스템 로그인",
// }

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProviders>{children}</ClientProviders>;
}
