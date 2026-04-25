<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="active==1?'text-green cur':''" @tap="tabSelect(1)">
					全部
				</view>
				<view class="cu-item flex-sub" :class="active==2?'text-green cur':''" @tap="tabSelect(2)">
					待审批
				</view>
			</view>
		</scroll-view>
		<view v-if="active == 1">
			<view class="cu-list menu-avatar margin-top" >
				<view class="cu-item arrow" v-for="(item,index) in visits" :key="index" @click="_todoUndo(item)">
					<view class="content" style="left: 10upx;">
						<view class="text-grey">
							<text class="ellip">{{item.name}}访问{{item.ownerName}}</text>
						</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								访问时间：{{item.visitTime}}
							</view>
						</view>
					</view>
					<view  class="action">
						<view class="text-grey text-xs">{{item.stateName}}
							<text class="lg text-gray cuIcon-right margin-left-xs"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="active == 2">
			<view class="cu-list menu-avatar margin-top" >
				<view class="cu-item arrow" v-for="(item,index) in visits" :key="index" @click="_todoFinish(item)">
					<view class="content" style="left: 10upx;">
						<view class="text-grey">
							<text class="ellip">{{item.name}}访问{{item.ownerName}}</text>
						</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								访问时间：{{item.visitTime}}
							</view>
						</view>
					</view>
					<view  class="action">
						<view class="text-grey text-xs">{{item.stateName}}
							<text class="lg text-gray cuIcon-right margin-left-xs"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getVisit} from '../../api/visit/visitApi.js';
	import { getCommunityId } from '../../api/community/community.js';
	export default {
		data() {
			return {
				active: 1,
				visits: []
			}
		},
		onLoad() {
			this.java110Context.onLoad()
			this.tabSelect(1);
		},
		methods: {
			tabSelect: function(_active) {
				this.active = _active;
				this._queryVisits(_active);
			},
			_queryVisits: function(_active) {
				let _that = this;
				let _state = '';
				if(_active == 2){
					_state = '0'
				}
				
				getVisit(this, {
					page: 1,
					row: 100,
					communityId:getCommunityId(),
					state:_state,
					
				}).then(_data => {
					_that.visits = _data.data;
				})
				
			},
			_todoUndo:function(_undo){
				uni.navigateTo({
					url:'/pages/visit/visitDetail?visitId='+ _undo.visitId +
                    "&taskId=" + _undo.taskId
				})
			},
			_todoFinish:function(_undo){
				uni.navigateTo({
					url:'/pages/visit/visitDetail?vId='+ _undo.visitId 
				})
			}
		}
	}
</script>

<style>

</style>
