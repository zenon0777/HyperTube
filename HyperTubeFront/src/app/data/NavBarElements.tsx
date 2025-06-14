import { Home, Movie } from "@mui/icons-material";
import { AbstractIntlMessages } from 'next-intl';

interface NavElement {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface Genre {
  id: number;
  name: string;
}

export const getNavElements = (t: (key: string) => string): NavElement[] => [
  {
    name: t("navBar.home"),
    path: "/home",
    icon: <Home />,
  },
  {
    name: t("navBar.movies"),
    path: "/browse/movies",
    icon: <Movie />,
  },
];

export const getGenres = (t: (key: string) => string): Genre[] => [
  { id: 28, name: t("genres.action") },
  { id: 10759, name: t("genres.actionAdventure") },
  { id: 12, name: t("genres.adventure") },
  { id: 16, name: t("genres.animation") },
  { id: 35, name: t("genres.comedy") },
  { id: 80, name: t("genres.crime") },
  { id: 99, name: t("genres.documentary") },
  { id: 18, name: t("genres.drama") },
  { id: 10751, name: t("genres.family") },
  { id: 14, name: t("genres.fantasy") },
  { id: 10765, name: t("genres.sciFiFantasy") },
  { id: 36, name: t("genres.history") },
  { id: 27, name: t("genres.horror") },
  { id: 10762, name: t("genres.kids") },
  { id: 10402, name: t("genres.music") },
  { id: 9648, name: t("genres.mystery") },
  { id: 10763, name: t("genres.news") },
  { id: 10764, name: t("genres.reality") },
  { id: 10749, name: t("genres.romance") },
  { id: 878, name: t("genres.scienceFiction") },
  { id: 10766, name: t("genres.soap") },
  { id: 10767, name: t("genres.talk") },
  { id: 10770, name: t("genres.tvMovie") },
  { id: 53, name: t("genres.thriller") },
  { id: 10768, name: t("genres.warPolitics") },
  { id: 10752, name: t("genres.war") },
  { id: 37, name: t("genres.western") }
];
