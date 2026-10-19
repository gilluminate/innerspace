import { Icon, Keyboard, LaunchType, MenuBarExtra, launchCommand, open, openExtensionPreferences } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { STORAGE_SETTINGS_URL, formatBytes, getDiskUsage, getVolumePath } from "./disk";

export default function Command() {
  const volumePath = getVolumePath();
  const { data, error, isLoading, revalidate } = usePromise(getDiskUsage, [volumePath]);

  const title = data ? `${data.percentUsed}%` : error ? "–" : "…";

  return (
    <MenuBarExtra title={title} isLoading={isLoading} tooltip={`Disk space used on ${volumePath}`}>
      <MenuBarExtra.Section title={volumePath}>
        {data && (
          <>
            <MenuBarExtra.Item title={`Used: ${formatBytes(data.used)} of ${formatBytes(data.total)}`} />
            <MenuBarExtra.Item title={`Available: ${formatBytes(data.available)}`} />
          </>
        )}
        {error && <MenuBarExtra.Item title={`Couldn't read volume: ${error.message}`} />}
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Refresh"
          icon={Icon.ArrowClockwise}
          shortcut={Keyboard.Shortcut.Common.Refresh}
          onAction={revalidate}
        />
        <MenuBarExtra.Item
          title="Open Disk Space…"
          icon={Icon.HardDrive}
          onAction={() => launchCommand({ name: "disk-space", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item title="Open Storage Settings" icon={Icon.Gear} onAction={() => open(STORAGE_SETTINGS_URL)} />
        <MenuBarExtra.Item title="Preferences…" icon={Icon.Cog} onAction={openExtensionPreferences} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
