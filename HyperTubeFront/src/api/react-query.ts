import { QueryFunctionContext, UseQueryOptions, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIClient } from './apiHelper';
import { AxiosError, AxiosResponse } from "axios";

export const api = new APIClient();
type QueryKeyT = [string, object | undefined];
type Updater<T, S> = (oldData: T | undefined, newData: S) => T;
export interface GetInfinitePagesInterface<T> {
    nextId?: number;
    previousId?: number;
    data: T;
    count: number;
}


export const fetcher = async <T>({
    queryKey,
    pageParam, // to use after for loading more
    signal, // to use after
}: QueryFunctionContext<QueryKeyT>): Promise<any> => {
    const [url, params] = queryKey;
    try {
        const response = await api.get(url, params);
        return response;
    } catch (error) {
        throw new Error((error as AxiosError)?.response?.data?.message || (error as AxiosError)?.message);
    }
};

export const useFetch = <T>(
    url: string | null,
    params?: object,
    config?: UseQueryOptions<T, Error, T, QueryKeyT>,
    queryKey?: QueryKeyT
) => {
    const context = useQuery<T, Error, T, QueryKeyT>({
        queryKey: [url || '', params],
        queryFn: fetcher,
        ...config,
    });

    return context;
};

export const useLoadMore = <T>(url: string | null, params?: object) => {
    const context = useInfiniteQuery<
        GetInfinitePagesInterface<T>,
        Error,
        GetInfinitePagesInterface<T>,
        QueryKeyT
    >({
        queryKey: [url || '', params],
        queryFn: fetcher,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (lastPage, pages) => lastPage.previousId,
        initialPageParam: null,
    });

    return context;
};


const useGenericMutation = <T, S>(
  func: (data: T | S) => Promise<AxiosResponse<S>>,
  url: string,
  params?: object,
  updater?: Updater<T, S>
) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, T | S>({
    mutationFn: func,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [url!, params] });

      const previousData = queryClient.getQueryData([url!, params]);

      queryClient.setQueryData<T>([url!, params], (oldData) => {
        if (updater) {
          if (Array.isArray(oldData)) {
            return updater(oldData, data as S);
          } else {
            console.warn("oldData is not an array:", oldData);
            return updater([] as unknown as T, data as S);
          }
        } else {
          return data as T;
        }
      });

      return previousData;
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([url!, params], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [url!, params] });
    },
  });
};

export const usePost = <T, S>(
    url: string,
    params?: object,
    updater?: Updater<T, S>
) => {
    const apiPost: (data: T | S) => Promise<AxiosResponse<S>> = (data) => api.post(url, data);
    return useGenericMutation<T, S>(
        apiPost,
        url,
        params,
        updater
    );
};

export const usePut = <T, S>(
  url: string,
  params?: object,
  updater?: Updater<T, S>
) => {
  const apiPut: (data: T | S) => Promise<AxiosResponse<S>> = (data) => api.put(url, data);
  return useGenericMutation<T, S>(
    apiPut,
    url,
    params,
    updater
  );
}

export const useDelete = <T, S>(
  url: string,
  params?: object,
  updater?: Updater<T, S>
) => {
  const apiDelete: (data: T | S) => Promise<AxiosResponse<S>> = (data) => api.delete(url, data);
  return useGenericMutation<T, S>(
    apiDelete,
    url,
    params,
    updater
  );
}

// export const usePatch = <T, S>(
//   url: string,
//   params?: object,
//   updater?: Updater<T, S>
// ) => {
//   const apiPatch: (data: T) => Promise<AxiosResponse<S>> = (data) => api.patch(url, data);
//   return useGenericMutation<T, S>(
//     apiPatch,
//     url,
//     params,
//     updater
//   );
// }