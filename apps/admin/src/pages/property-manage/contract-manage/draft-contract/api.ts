import { computed, toValue, type Ref } from "vue";
import { useMutation, useQuery, type UseMutationReturnType } from "@tanstack/vue-query";
import { http } from "@/utils/http";
import type {
	ContractDraftDetailVO,
	DraftContractCreatePayload,
	DraftContractDeletePayload,
	DraftContractUpdatePayload,
	JsonVO,
} from "@01s-11comm/type";

const BASE_URL = "/api/property-manage/contract-manage/draft-contract";

const DETAIL_URL = `${BASE_URL}/detail`;
const CREATE_URL = `${BASE_URL}/create`;
const UPDATE_URL = `${BASE_URL}/update`;
const DELETE_URL = `${BASE_URL}/delete`;

export async function fetchDraftContractDetail(contractId: string) {
	const response = await http.post<JsonVO<ContractDraftDetailVO>, { id: string }>(DETAIL_URL, {
		data: { id: contractId },
	});

	return response?.data ?? null;
}

export function useDraftContractDetailQuery(contractId: Ref<string | undefined>) {
	const enabled = computed(() => Boolean(toValue(contractId)));

	return useQuery({
		queryKey: computed(() => ["draft-contract-detail", toValue(contractId)] as const),
		queryFn: async () => {
			const id = toValue(contractId);
			if (!id) {
				return null;
			}

			return fetchDraftContractDetail(id);
		},
		enabled,
	});
}

export function useDraftContractCreateMutation(): UseMutationReturnType<
	JsonVO<unknown>,
	Error,
	DraftContractCreatePayload,
	unknown
> {
	return useMutation({
		mutationFn: (payload) => http.post<JsonVO<unknown>, DraftContractCreatePayload>(CREATE_URL, { data: payload }),
	});
}

export function useDraftContractUpdateMutation(): UseMutationReturnType<
	JsonVO<unknown>,
	Error,
	DraftContractUpdatePayload,
	unknown
> {
	return useMutation({
		mutationFn: (payload) => http.post<JsonVO<unknown>, DraftContractUpdatePayload>(UPDATE_URL, { data: payload }),
	});
}

export function useDraftContractDeleteMutation(): UseMutationReturnType<
	JsonVO<unknown>,
	Error,
	DraftContractDeletePayload,
	unknown
> {
	return useMutation({
		mutationFn: (payload) => http.post<JsonVO<unknown>, DraftContractDeletePayload>(DELETE_URL, { data: payload }),
	});
}
