import type { Message } from "revolt.js";
import { Match, Switch } from "solid-js";
import { useTranslation } from "@revolt/i18n";
import { styled } from "solid-styled-components";
import { Avatar, ColouredText, OverflowingText, Row } from "../../design";
import { Show } from "solid-js";
import { BiSolidFile } from "solid-icons/bi";
import { TextWithEmoji } from "@revolt/markdown";
import { generateTypographyCSS } from "../../design/atoms/display/Typography";

interface Props {
  /**
   * Message that was replied to
   */
  message?: Message;

  /**
   * Whether it was mentioned
   */
  mention?: boolean;

  /**
   * Whether to hide the left side reply indicator
   */
  noDecorations?: boolean;
}

export const Base = styled("div", "Reply")<Pick<Props, "noDecorations">>`
  min-width: 0;
  flex-grow: 1;
  display: flex;
  user-select: none;
  align-items: center;

  margin-inline-end: ${(props) => (props.noDecorations ? "0" : "12px")};
  margin-inline-start: ${(props) => (props.noDecorations ? "0" : "30px")};

  ${(props) => generateTypographyCSS(props.theme!, "reply")}

  gap: ${(props) => props.theme!.gap.md};

  &::before {
    display: ${(props) => (props.noDecorations ? "none" : "block")};

    content: "";
    width: 22px;
    height: 8px;

    flex-shrink: 0;
    align-self: flex-end;

    border-inline-start: 2px solid
      ${(props) => props.theme!.colours["background-300"]};
    border-top: 2px solid ${(props) => props.theme!.colours["background-300"]};
  }
`;

const Attachments = styled.em`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme!.gap.sm};
  color: ${(props) => props.theme!.colours["foreground-200"]};
`;

/**
 * Information text
 */
const InfoText = styled.a`
  color: ${(props) => props.theme!.colours["foreground-400"]};
`;

export function MessageReply(props: Props) {
  const t = useTranslation();

  return (
    <Base noDecorations={props.noDecorations}>
      <Switch
        fallback={<InfoText>{t("app.main.channel.misc.not_loaded")}</InfoText>}
      >
        <Match when={props.message?.author?.relationship === "Blocked"}>
          {t("app.main.channel.misc.blocked_user")}
        </Match>
        <Match when={props.message}>
          <Avatar src={props.message!.avatarURL} size={14} />
          <OverflowingText>
            <ColouredText
              colour={props.message!.roleColour!}
              clip={props.message!.roleColour?.includes("gradient")}
            >
              {props.message!.username}
            </ColouredText>
          </OverflowingText>
          <Show when={props.message!.attachments}>
            <Attachments>
              <BiSolidFile size={16} />
              {props.message!.attachments!.length > 1
                ? t("app.main.channel.misc.sent_multiple_files")
                : t("app.main.channel.misc.sent_file")}
            </Attachments>
          </Show>
          <Show when={props.message!.content}>
            <OverflowingText>
              <TextWithEmoji content={props.message!.content!} />
            </OverflowingText>
          </Show>
        </Match>
      </Switch>
    </Base>
  );
}
