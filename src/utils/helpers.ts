const generateFixtureLink = (fixtureId: string): string => {
  const host = process.env.HOST || "http://localhost";
  return `${host}/fixture/${fixtureId}`;
};
