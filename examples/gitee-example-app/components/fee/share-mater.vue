<template>
	<view>
		<view class="cu-list grid margin-top-sm" :class="'col-2'" v-if="meters.length > 0">
			<view class="cu-item" @click="_toAddMeterReading(item)" v-for="(item,index) in meters" :key="index">
				<view>
					<image src="/static/image/index_meter.png" style="width: 80upx;height: 80upx;"></image>
				</view>
				<view>
					<text>{{item.floorNum}}栋-{{item.meterTypeName}}</text>
				</view>
				<view v-if="item.meterNum">
					<text>{{item.meterNum}}</text>
				</view>
			</view>
		</view>
		<view v-else>
			<no-data-page></no-data-page>
		</view>
	</view>
</template>

<script>
	import noDataPage from '../no-data-page/no-data-page.vue';
	import {
		getCommunityId
	} from '@/api/community/community.js'
	import {
		getFloorShareReading,
		getFloorShareMeter
	} from '@/api/fee/fee.js';
	export default {
		name:"shareMater",
		data() {
			return {
				meters:[]
			};
		},
		created() {
			this._loadFloorShareMater();
		},
		components: {
			noDataPage
		},
		methods: {

			_loadFloorShareMater: function() {
				let _that = this;
				getFloorShareMeter(this, {
					page: 1,
					row: 100,
					communityId: getCommunityId()
				}).then(_data => {
					_that.meters = _data.data;
				});
			},
			_toAddMeterReading: function(_mater) {
				uni.navigateTo({
					url: '/pages/meter/addShareReading?fsmId=' + _mater.fsmId
				})
			},
		}
	}
</script>

<style>

</style>