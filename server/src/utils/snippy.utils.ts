export const omit = (key: string) => {
  return (obj: any) => {
    const { [key]: _, ...rest } = obj;
    return rest;
  };
};
