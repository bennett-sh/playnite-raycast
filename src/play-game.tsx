import { List, ActionPanel, Action, Icon, Detail, showToast, Toast, Image } from "@raycast/api";
import { useState } from "react";
import { usePlaynite } from "./hooks/usePlaynite";

function ErrorView({ error }: { error: string }) {
  const isAddonError = error.includes("FlowLauncherExporter");

  if (isAddonError) {
    return (
      <List>
        <List.EmptyView
          title="Playnite Extension Required"
          description="Please install the FlowLauncherExporter addon"
          icon={Icon.Download}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title="Download FlowLauncherExporter"
                url="https://github.com/Garulf/FlowLauncherExporter/releases/latest"
                icon={Icon.Download}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return <Detail markdown={`# Error\n\n${error}`} />;
}

export default function Command() {
  const { games, isLoading, error, launchGame, viewInPlaynite, openInstallFolder, defaultFilter } = usePlaynite();
  const [installFilter, setInstallFilter] = useState(defaultFilter || "installed");

  if (error) {
    return <ErrorView error={error} />;
  }

  const filteredGames = games
    .filter((game) => {
      if (installFilter === "installed") return game.IsInstalled;
      if (installFilter === "notInstalled") return !game.IsInstalled;
      return true;
    })
    .sort((a, b) => {
      if (a.Playtime > 0 && b.Playtime > 0) {
        return b.Playtime - a.Playtime;
      }
      if (a.Playtime > 0 && b.Playtime === 0) {
        return -1;
      }
      if (a.Playtime === 0 && b.Playtime > 0) {
        return 1;
      }
      return a.Name.localeCompare(b.Name);
    });

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search games..."
      searchBarAccessory={
        <List.Dropdown tooltip="Filter by installation status" value={installFilter} onChange={setInstallFilter}>
          <List.Dropdown.Item title="Installed" value="installed" />
          <List.Dropdown.Item title="Not Installed" value="notInstalled" />
          <List.Dropdown.Item title="All" value="all" />
        </List.Dropdown>
      }
    >
      {filteredGames.map((game) => {
        try {
          return (
            <List.Item
              key={game.Id}
              title={game.Name}
              subtitle={game.Source?.Name || "Other"}
              icon={game.Icon ? { source: game.Icon, mask: Image.Mask.RoundedRectangle } : Icon.GameController}
              accessories={[
                ...(game.Playtime > 0 ? [{ tag: `${Math.round(game.Playtime / 3600)}h` }] : []),
                { text: game.IsInstalled ? "Installed" : "Not Installed" },
              ]}
              actions={
                <ActionPanel>
                  <Action
                    title={game.IsInstalled ? "Launch Game" : "Game Not Installed"}
                    icon={game.IsInstalled ? Icon.Play : Icon.XMarkCircle}
                    onAction={() => launchGame(game)}
                  />
                  <Action
                    title="View in Playnite"
                    icon={Icon.Eye}
                    shortcut={{ modifiers: ["cmd"], key: "p" }}
                    onAction={() => viewInPlaynite(game)}
                  />
                  {game.IsInstalled && game.InstallDirectory && (
                    <Action
                      title="Open Install Folder"
                      icon={Icon.Folder}
                      shortcut={{ modifiers: ["cmd"], key: "f" }}
                      onAction={() => openInstallFolder(game)}
                    />
                  )}
                </ActionPanel>
              }
            />
          );
        } catch (error: unknown) {
          showToast({
            style: Toast.Style.Failure,
            title: "Error rendering game",
            message: `Game ID: ${game?.Id || "unknown"}, Error: ${error}`,
          });
          return (
            <List.Item
              key={game?.Id || Math.random()}
              title="[ERROR] Failed to render game"
              subtitle={`ID: ${game?.Id || "unknown"}`}
              icon={Icon.ExclamationMark}
            />
          );
        }
      })}
    </List>
  );
}
