import { useTranslation } from "@revolt/i18n";
import { Markdown } from "@revolt/markdown";
import { Message as MessageInterface } from "revolt.js";
import { BiRegularLink, BiSolidBot, BiSolidShield } from "solid-icons/bi";
import { For, Match, onMount, Show, Switch } from "solid-js";
import { Column } from "../../design";
import { Username } from "../../design/atoms/display/Username";
import { Tooltip, UserCard } from "../../floating";
import { Attachment } from "./Attachment";
import { MessageContainer } from "./Container";
import { Embed } from "./Embed";
import { MessageReply } from "./MessageReply";

/**
 * Render a Message with or without a tail
 */
export function Message(props: { message: MessageInterface; tail?: boolean }) {
  const baseUrl = props.message.client.configuration?.features.autumn.url!;
  const t = useTranslation();

  return (
    <MessageContainer
      username={
        <UserCard user={props.message.author!} member={props.message.member}>
          {(triggerProps) => (
            <Username
              {...triggerProps}
              username={props.message.username}
              colour={props.message.roleColour!}
            />
          )}
        </UserCard>
      }
      avatar={props.message.avatarURL}
      timestamp={props.message.createdAt}
      edited={props.message.edited ? +props.message.edited : undefined}
      tail={props.tail}
      header={
        <Show when={props.message.reply_ids}>
          <For each={props.message.reply_ids}>
            {(reply_id) => {
              const message = () => props.message.client.messages.get(reply_id);

              onMount(() => {
                if (!message()) {
                  props.message.channel!.fetchMessage(reply_id);
                }
              });

              return <MessageReply message={message()} />;
            }}
          </For>
        </Show>
      }
      info={
        <Switch fallback={<div />}>
          <Match
            when={
              props.message.masquerade &&
              props.message.author_id === "01FHGJ3NPP7XANQQH8C2BE44ZY"
            }
          >
            <Tooltip
              content={t("app.main.channel.bridged")}
              placement="top"
              aria
            >
              {(triggerProps) => <BiRegularLink {...triggerProps} size={16} />}
            </Tooltip>
          </Match>
          <Match when={props.message.author?.privileged}>
            <Tooltip content={t("app.main.channel.team")} placement="top" aria>
              {(triggerProps) => <BiSolidShield {...triggerProps} size={16} />}
            </Tooltip>
          </Match>
          <Match when={props.message.author?.bot}>
            <Tooltip content={t("app.main.channel.bot")} placement="top" aria>
              {(triggerProps) => <BiSolidBot {...triggerProps} size={16} />}
            </Tooltip>
          </Match>
          {/* inline status <Match
            when={props.message.author_id === "01EX2NCWQ0CHS3QJF0FEQS1GR4"}
          >
            revolt &middot;{" "}
          </Match>*/}
        </Switch>
      }
    >
      <Column gap="sm">
        <Show when={props.message.content}>
          <Markdown content={props.message.content!} />
        </Show>
        <Show when={props.message.system}>
          {props.message.asSystemMessage.type}
        </Show>
        <Show when={props.message.attachments}>
          <For each={props.message.attachments}>
            {(attachment) => <Attachment file={attachment} baseUrl={baseUrl} />}
          </For>
        </Show>
        <Show when={props.message.embeds}>
          <For each={props.message.embeds}>
            {(embed) => (
              <Embed
                embed={embed}
                proxyFile={props.message.client.proxyFile}
                baseUrl={baseUrl}
              />
            )}
          </For>
        </Show>
      </Column>
    </MessageContainer>
  );
}
