import { Avatar, AvatarSize } from "@fluentui/react-components";

export function makeAvatar(item: NameIcon, size: AvatarSize = 24) {
    return <Avatar icon={item.icon} size={size} />;
}
