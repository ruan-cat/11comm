// @ts-nocheck
import Sortable from "sortablejs";
import { ElDropdownItem, ElDropdownMenu } from "element-plus";
import type { TableColumns } from "@pureadmin/table";
import { transformI18n } from "@/plugins/i18n";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { type PropType, ref, unref, computed, nextTick, defineComponent, getCurrentInstance, isVNode } from "vue";
import { delay, cloneDeep, isBoolean, isFunction } from "@pureadmin/utils";

import Fullscreen from "~icons/ri/fullscreen-fill";
import ExitFullscreen from "~icons/ri/fullscreen-exit-fill";
import DragIcon from "@/assets/table-bar/drag.svg?component";
import ExpandIcon from "@/assets/table-bar/expand.svg?component";
import RefreshIcon from "@/assets/table-bar/refresh.svg?component";
import SettingIcon from "@/assets/table-bar/settings.svg?component";
import CollapseIcon from "@/assets/table-bar/collapse.svg?component";

const props = {
	/** 头部最左边的标题 */
	title: {
		type: String,
		default: "列表",
	},
	/** 对于树形表格，如果想启用展开和折叠功能，传入当前表格的ref即可 */
	tableRef: {
		type: Object as PropType<any>,
	},
	/** 需要展示的列 */
	columns: {
		type: Array as PropType<TableColumnList>,
		default: () => [],
	},
	isExpandAll: {
		type: Boolean,
		default: true,
	},
	tableKey: {
		type: [String, Number] as PropType<string | number>,
		default: "0",
	},
};

import type { ExtractPropTypes } from "vue";

export type PureTableBarProps = Partial<ExtractPropTypes<typeof props>>;

export default defineComponent({
	name: "PureTableBar",
	props,
	emits: ["refresh", "fullscreen"],
	setup(props, { emit, slots, attrs }) {
		const size = ref("default");
		const loading = ref(false);
		const checkAll = ref(true);
		const isFullscreen = ref(false);
		const isIndeterminate = ref(false);
		const instance = getCurrentInstance()!;
		const isExpandAll = ref(props.isExpandAll);

		/**
		 * 统一解析列设置弹层里使用的列名。
		 *
		 * 这个函数故意放在 `setup` 内部，只服务当前组件自身，
		 * 避免被组件外部误复用后逐渐演变成新的公共入口。
		 *
		 * 之前这里直接读取 `label`，但项目现在为了让表头跟随 i18n 动态切换，
		 * 很多列已经改成只配置 `headerRenderer`。如果列设置弹层还只认 `label`，
		 * 这些列就会直接从筛选列表里消失，表现出来就是“表格列无法筛选”。
		 *
		 * 因此这里统一兼容两种来源：
		 * 1. 旧写法里的 `label`
		 * 2. 新写法里的 `headerRenderer`
		 *
		 * 同时把 `headerRenderer` 的返回值限制在当前组件内部解析，确保
		 * 勾选、重置、固定列判断都使用完全相同的一套规则，减少后续分叉。
		 */
		function getColumnFilterLabel(column: TableColumns, index = 0): string | undefined {
			function extractRenderedHeaderText(renderedHeader: unknown): string | undefined {
				if (typeof renderedHeader === "string" || typeof renderedHeader === "number") {
					const text = String(renderedHeader).trim();
					return text || undefined;
				}

				if (Array.isArray(renderedHeader)) {
					const text = renderedHeader
						.map((item) => extractRenderedHeaderText(item))
						.filter(Boolean)
						.join("")
						.trim();

					return text || undefined;
				}

				if (isVNode(renderedHeader)) {
					return extractRenderedHeaderText(renderedHeader.children);
				}

				return undefined;
			}

			if (typeof column?.label === "string" && column.label.trim()) {
				return column.label;
			}

			if (!isFunction(column?.headerRenderer)) {
				return undefined;
			}

			return extractRenderedHeaderText(
				column.headerRenderer({
					column,
					$index: index,
					index,
					props: {},
					attrs: {},
				}),
			);
		}

		/** 统一生成列设置弹层使用的列名列表，避免重复书写相同的遍历逻辑。 */
		function getColumnFilterLabelList(columns: TableColumnList = []) {
			const labelList: string[] = [];

			columns.forEach((column, index) => {
				const label = getColumnFilterLabel(column, index);
				if (label) {
					labelList.push(label);
				}
			});

			return labelList;
		}

		const filterColumns = cloneDeep(props?.columns).filter((column) =>
			isBoolean(column?.hide) ? !column.hide : !(isFunction(column?.hide) && column?.hide()),
		);
		let checkColumnList = getColumnFilterLabelList(cloneDeep(props?.columns));
		const checkedColumns = ref(getColumnFilterLabelList(cloneDeep(filterColumns)));
		const dynamicColumns = ref(cloneDeep(props?.columns));

		const getDropdownItemStyle = computed(() => {
			return (s) => {
				return {
					background: s === size.value ? useEpThemeStoreHook().epThemeColor : "",
					color: s === size.value ? "#fff" : "var(--el-text-color-primary)",
				};
			};
		});

		const iconClass = computed(() => {
			return [
				"text-black",
				"dark:text-white",
				"duration-100",
				"hover:text-primary!",
				"cursor-pointer",
				"outline-hidden",
			];
		});

		const topClass = computed(() => {
			return [
				"flex",
				"justify-between",
				"pt-[3px]",
				"px-[11px]",
				"border-b-[1px]",
				"border-solid",
				"border-[#dcdfe6]",
				"dark:border-[#303030]",
			];
		});

		function onReFresh() {
			loading.value = true;
			emit("refresh");
			delay(500).then(() => (loading.value = false));
		}

		function onExpand() {
			isExpandAll.value = !isExpandAll.value;
			toggleRowExpansionAll(props.tableRef.data, isExpandAll.value);
		}

		function onFullscreen() {
			isFullscreen.value = !isFullscreen.value;
			emit("fullscreen", isFullscreen.value);
		}

		function toggleRowExpansionAll(data, isExpansion) {
			data.forEach((item) => {
				props.tableRef.toggleRowExpansion(item, isExpansion);
				if (item.children !== undefined && item.children !== null) {
					toggleRowExpansionAll(item.children, isExpansion);
				}
			});
		}

		function handleCheckAllChange(val: boolean) {
			checkedColumns.value = val ? checkColumnList : [];
			isIndeterminate.value = false;
			dynamicColumns.value.map((column) => (val ? (column.hide = false) : (column.hide = true)));
		}

		function handleCheckedColumnsChange(value: string[]) {
			checkedColumns.value = value;
			const checkedCount = value.length;
			checkAll.value = checkedCount === checkColumnList.length;
			isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumnList.length;
		}

		function handleCheckColumnListChange(val: boolean, label: string) {
			const targetColumn = dynamicColumns.value.find(
				(item, index) => transformI18n(getColumnFilterLabel(item, index) ?? "") === transformI18n(label),
			);
			if (targetColumn) {
				targetColumn.hide = !val;
			}
		}

		async function onReset() {
			checkAll.value = true;
			isIndeterminate.value = false;
			dynamicColumns.value = cloneDeep(props?.columns);
			checkColumnList = [];
			checkColumnList = await getColumnFilterLabelList(cloneDeep(props?.columns));
			checkedColumns.value = getColumnFilterLabelList(cloneDeep(filterColumns));
		}

		const dropdown = {
			dropdown: () => (
				<ElDropdownMenu class='translation'>
					<ElDropdownItem style={getDropdownItemStyle.value("large")} onClick={() => (size.value = "large")}>
						宽松
					</ElDropdownItem>
					<ElDropdownItem style={getDropdownItemStyle.value("default")} onClick={() => (size.value = "default")}>
						默认
					</ElDropdownItem>
					<ElDropdownItem style={getDropdownItemStyle.value("small")} onClick={() => (size.value = "small")}>
						紧凑
					</ElDropdownItem>
				</ElDropdownMenu>
			),
		};

		/** 列展示拖拽排序 */
		const rowDrop = (event: { preventDefault: () => void }) => {
			event.preventDefault();
			nextTick(() => {
				const wrapper: HTMLElement = (instance?.proxy?.$refs[`GroupRef${unref(props.tableKey)}`] as any).$el
					.firstElementChild;
				Sortable.create(wrapper, {
					animation: 300,
					handle: ".drag-btn",
					onEnd: ({ newIndex, oldIndex, item }) => {
						const targetThElem = item;
						const wrapperElem = targetThElem.parentNode as HTMLElement;
						const oldColumn = dynamicColumns.value[oldIndex];
						const newColumn = dynamicColumns.value[newIndex];
						if (oldColumn?.fixed || newColumn?.fixed) {
							// 当前列存在fixed属性 则不可拖拽
							const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
							if (newIndex > oldIndex) {
								wrapperElem.insertBefore(targetThElem, oldThElem);
							} else {
								wrapperElem.insertBefore(targetThElem, oldThElem ? oldThElem.nextElementSibling : oldThElem);
							}
							return;
						}
						const currentRow = dynamicColumns.value.splice(oldIndex, 1)[0];
						dynamicColumns.value.splice(newIndex, 0, currentRow);
					},
				});
			});
		};

		const isFixedColumn = (label: string) => {
			return dynamicColumns.value.find(
				(item, index) => transformI18n(getColumnFilterLabel(item, index) ?? "") === transformI18n(label),
			)?.fixed
				? true
				: false;
		};

		const rendTippyProps = (content: string) => {
			// https://vue-tippy.netlify.app/props
			return {
				content,
				offset: [0, 18],
				duration: [300, 0],
				followCursor: true,
				hideOnClick: "toggle",
			};
		};

		const reference = {
			reference: () => <SettingIcon class={["w-[16px]", iconClass.value]} v-tippy={rendTippyProps("列设置")} />,
		};

		return () => (
			<>
				<div
					{...attrs}
					class={[
						"w-full",
						"px-2",
						"pb-2",
						"bg-bg_color",
						isFullscreen.value ? ["h-full!", "z-2002", "fixed", "inset-0"] : "mt-2",
					]}
				>
					<div class='flex justify-between w-full h-[60px] p-4'>
						{slots?.title ? slots.title() : <p class='font-bold truncate'>{props.title}</p>}
						<div class='flex items-center justify-around'>
							{slots?.buttons ? <div class='flex mr-4'>{slots.buttons()}</div> : null}
							{props.tableRef?.size ? (
								<>
									<ExpandIcon
										class={["w-[16px]", iconClass.value]}
										style={{
											transform: isExpandAll.value ? "none" : "rotate(-90deg)",
										}}
										v-tippy={rendTippyProps(isExpandAll.value ? "折叠" : "展开")}
										onClick={() => onExpand()}
									/>
									<el-divider direction='vertical' />
								</>
							) : null}
							<RefreshIcon
								class={["w-[16px]", iconClass.value, loading.value ? "animate-spin" : ""]}
								v-tippy={rendTippyProps("刷新")}
								onClick={() => onReFresh()}
							/>
							<el-divider direction='vertical' />
							<el-dropdown v-slots={dropdown} trigger='click' v-tippy={rendTippyProps("密度")}>
								<CollapseIcon class={["w-[16px]", iconClass.value]} />
							</el-dropdown>
							<el-divider direction='vertical' />

							<el-popover
								v-slots={reference}
								placement='bottom-start'
								popper-style={{ padding: 0 }}
								width='200'
								trigger='click'
							>
								<div class={[topClass.value]}>
									<el-checkbox
										class='-mr-1!'
										label='列展示'
										v-model={checkAll.value}
										indeterminate={isIndeterminate.value}
										onChange={(value) => handleCheckAllChange(value)}
									/>
									<el-button type='primary' link onClick={() => onReset()}>
										重置
									</el-button>
								</div>

								<div class='pt-[6px] pl-[11px]'>
									<el-scrollbar max-height='36vh'>
										<el-checkbox-group
											ref={`GroupRef${unref(props.tableKey)}`}
											modelValue={checkedColumns.value}
											onChange={(value) => handleCheckedColumnsChange(value)}
										>
											<el-space direction='vertical' alignment='flex-start' size={0}>
												{checkColumnList.map((item, index) => {
													return (
														<div class='flex items-center'>
															<DragIcon
																class={[
																	"drag-btn w-[16px] mr-2",
																	isFixedColumn(item) ? "cursor-no-drop!" : "cursor-grab!",
																]}
																onMouseenter={(event: { preventDefault: () => void }) => rowDrop(event)}
															/>
															<el-checkbox
																key={index}
																label={item}
																value={item}
																onChange={(value) => handleCheckColumnListChange(value, item)}
															>
																<span
																	title={transformI18n(item)}
																	class='inline-block w-[120px] truncate hover:text-text_color_primary'
																>
																	{transformI18n(item)}
																</span>
															</el-checkbox>
														</div>
													);
												})}
											</el-space>
										</el-checkbox-group>
									</el-scrollbar>
								</div>
							</el-popover>
							<el-divider direction='vertical' />

							<iconifyIconOffline
								class={["w-[16px]", iconClass.value]}
								icon={isFullscreen.value ? ExitFullscreen : Fullscreen}
								v-tippy={isFullscreen.value ? "退出全屏" : "全屏"}
								onClick={() => onFullscreen()}
							/>
						</div>
					</div>
					{slots.default({
						size: size.value,
						dynamicColumns: dynamicColumns.value,
					})}
				</div>
			</>
		);
	},
});
