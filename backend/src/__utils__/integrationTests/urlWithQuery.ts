function urlWithQuery(baseUrl: string, query: Record<string, any>) {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, val]) => {
        if (val == null) return;
        params.append(key, val);
    });

    return `${baseUrl}?${params.toString()}`;
}

export default urlWithQuery;
