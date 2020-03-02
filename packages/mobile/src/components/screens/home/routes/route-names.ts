import { LocalStackRoute } from '../../../../types';

type Routes = 'HOME';

const LOCAL_ROUTES: Record<Routes, LocalStackRoute> = {
  HOME: {
    title: 'Home',
    id: 'HOME',
  },
};

export default LOCAL_ROUTES;
