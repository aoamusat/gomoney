export const generateFixtureLink = (fixtureId: string): string => {
  const host = process.env.HOST || "http://localhost";
  return `${host}/fixtures/${fixtureId}`;
};

export const sum = (a: number, b: number): number => a + b;
