import { Action, ActionPanel, Detail, Icon, Keyboard, open, openExtensionPreferences } from "@raycast/api";
import { showFailureToast, usePromise } from "@raycast/utils";
import { type DiskUsage, formatBytes, getDiskUsage, getVolumePath, STORAGE_SETTINGS_URL, summarize } from "./disk";

const BAR_CELLS = 30;

function progressBar(percent: number): string {
  const filled = Math.round((Math.min(Math.max(percent, 0), 100) / 100) * BAR_CELLS);
  return "█".repeat(filled) + "░".repeat(BAR_CELLS - filled);
}

function markdownFor(usage: DiskUsage): string {
  return [
    `# Disk Space`,
    ``,
    `\`${usage.path}\``,
    ``,
    `\`${progressBar(usage.percentUsed)}\` **${usage.percentUsed}%**`,
    ``,
    `| | |`,
    `|---|---|`,
    `| Used | ${formatBytes(usage.used)} |`,
    `| Available | ${formatBytes(usage.available)} |`,
    `| Total | ${formatBytes(usage.total)} |`,
    ``,
    `_Finder and System Settings count purgeable space as available, so their numbers can read higher._`,
  ].join("\n");
}

export default function Command() {
  const volumePath = getVolumePath();
  const { data, isLoading, revalidate } = usePromise(getDiskUsage, [volumePath], {
    onError: (error) => {
      showFailureToast(error, { title: `Couldn't read ${volumePath}` });
    },
  });

  const markdown = data ? markdownFor(data) : isLoading ? "" : `# Disk Space\n\nCouldn't read \`${volumePath}\`.`;

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      metadata={
        data ? (
          <Detail.Metadata>
            <Detail.Metadata.Label title="Volume" text={data.path} />
            <Detail.Metadata.Label title="Used" text={`${data.percentUsed}%`} />
            <Detail.Metadata.Separator />
            <Detail.Metadata.Label title="Used" text={formatBytes(data.used)} />
            <Detail.Metadata.Label title="Available" text={formatBytes(data.available)} />
            <Detail.Metadata.Label title="Total" text={formatBytes(data.total)} />
          </Detail.Metadata>
        ) : undefined
      }
      actions={
        <ActionPanel>
          <Action
            title="Refresh"
            icon={Icon.ArrowClockwise}
            shortcut={Keyboard.Shortcut.Common.Refresh}
            onAction={revalidate}
          />
          {data && <Action.CopyToClipboard title="Copy Summary" content={summarize(data)} />}
          <ActionPanel.Section>
            <Action title="Open Storage Settings" icon={Icon.HardDrive} onAction={() => open(STORAGE_SETTINGS_URL)} />
            <Action title="Open Disk Utility" icon={Icon.Gear} onAction={() => open("Disk Utility")} />
            <Action title="Open Extension Preferences" icon={Icon.Cog} onAction={openExtensionPreferences} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
