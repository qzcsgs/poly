/**
 * 配置数据
 */
export default {
  /**
   * 游戏状态
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通关
   * stop 游戏暂停
   */
  status: 'start',
  score: 0,				// 得分，1:1体重计算
  map_x: parseInt((1600 - 3000) / 2),
  map_y: parseInt((1200 - 3000) / 2),
  map_width: 3000,		// 地图宽度
  map_height: 3000,		// 地图高度
  map_bgColor: '#777', 	// 地图背景色
  map_borderColor: 'red', // 地图边框颜色
  map_padding: 100, // 地图内边距
  player_name: '曲智超', 	// 玩家初始姓名
  player_color: 'gree', 	// 玩家初始颜色
  player_weight: 200, // 玩家初始体重
  player_centerX: 100, // 玩家初始圆心横坐标
  player_centerY: 100, // 玩家初始圆心纵坐标
  AiPlayer_num: 100, // 初始AI玩家数量
  AiPlayer_weight_length: [200, 500],	// Ai玩家初始体重范围
  AiPlayer_color: ['#82A6F5', '#EAF048', '#9FF048', '#F6D6FF'],
  food_num: 500, // 初始食物数量
  food_weight: 25, // 初始食物体重
  rankingList: [			// 排行列表

  ]
}
