import { ui } from 'reducers/ui';

export default function (ORM) {
  const orm = ORM.getEmptyState();

  return {
    orm,
    ui
  };
}
