import { List } from "immutable";
import * as React from "react";
import { Button, Row } from "./components/Button";
import SvgIcon from "./components/SvgIcon";
import { Theme } from "./types/Theme";

export interface ThemeProps {
  channel: any;
  api: any;
  active: boolean;
}

interface ButtonProps {
  onSelectTheme: (theme: Theme) => void;
  theme: Theme;
  onOpenModal: () => void;
  themes: List<Theme>;
}

const BaseComponent: React.FunctionComponent<ButtonProps> = ({
  onSelectTheme,
  themes,
  theme,
  onOpenModal,
}) => (
  /* tslint:disable:jsx-no-multiline-js jsx-no-lambda*/
  <Row>
    {themes
      .map((th, i) => (
        <Button
          isSelected={th === theme}
          key={i}
          onClick={() => onSelectTheme(th)}
        >
          <span>{th.name}</span>
          <SvgIcon style={{ marginLeft: "1em" }} name="info" onClick={() => onOpenModal()} />
        </Button>
      ))
      .toArray()}
  </Row>
);

export const Themes: React.FunctionComponent<ThemeProps> = ({
  channel,
  api,
  active,
}) => {
  const [theme, setTheme] = React.useState(null);
  const [themes, setThemes] = React.useState(List());

  const onReceiveThemes = (newThemes: Theme[]) => {
    // tslint:disable-next-line: no-shadowed-variable
    const themes = List(newThemes);
    const themeName = api.getQueryParam("theme");
    setThemes(themes);
    if (themes.count() > 0) {
      // tslint:disable-next-line: no-shadowed-variable
      const theme =
        themes.find((t) => t.name === themeName) || themes.first();
      setTheme(theme);
      channel.emit("selectTheme", theme);
    }
  };

  const onSelectTheme = (customTheme: Theme) => {
    setTheme(customTheme);
    api.setQueryParams({ theme: customTheme.name });
    channel.emit("selectTheme", customTheme);
  };

  const onOpenModal = () => {
    channel.emit("openModal", true);
  };

  React.useEffect(() => {
    channel.on("setThemes", onReceiveThemes);
    return () => {
      channel.removeListener("setThemes", onReceiveThemes);
    };
  }, []);

  return theme && active ? (
    <BaseComponent
      onOpenModal={onOpenModal}
      onSelectTheme={onSelectTheme}
      themes={themes}
      theme={theme}
    />
  ) : null;
};
