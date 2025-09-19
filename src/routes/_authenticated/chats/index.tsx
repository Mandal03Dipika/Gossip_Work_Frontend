import { createFileRoute } from "@tanstack/react-router";
import ChatContainer from "../../../features/Chat/components/ChatContainer";

export const Route = createFileRoute("/_authenticated/chats/")({
  component: ChatContainer,
});