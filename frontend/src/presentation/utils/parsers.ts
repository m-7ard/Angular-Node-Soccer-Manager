type DateOrFallback<T> = Date & { __type: T };

const parsers = {
    parseDateOrElse: <T>(rawValue: any, fallback: T): DateOrFallback<T> => {
        const cleanedDate = new Date(rawValue);
        return (isNaN(cleanedDate.getTime()) ? fallback : cleanedDate) as DateOrFallback<T>;
    },
};

export default parsers;
