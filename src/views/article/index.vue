<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <!-- 选中之后会把此行的label赋值给radio组件的status -->
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{ totalCount }}条结果：
      </div>
      <el-table
        class="list-table"
        size="mini"
        :data="articles"
        style="width: 100%"
        stripe
        v-loading="loading"
      >
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <!-- <img
              class="article-cover"
              :src="scope.row.cover.images[0] || './no-cover.webp'"
              alt=""
            /> -->
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="article-cover"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img v-else class="article-cover" src="./no-cover.webp" alt="" /> -->
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div></el-image
            >
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.status === 3"
              >审核失败</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.status === 4"
              >已删除</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              circle
              icon="el-icon-edit"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onCurrentChange"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from "@/api/article";
export default {
  name: "ArticleIndex",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      articles: [],
      articleStatus: [
        {
          text: "草稿",
        },
        {
          text: "待审核",
        },
        {
          text: "审核通过",
        },
        {
          text: "审核失败",
        },
        {
          text: "已删除",
        },
      ],
      totalCount: 0, //总数据条数
      pageSize: 10,
      status: null,
      channels: [], //文章频道列表
      channelId: null, //查询文章的频道
      rangeDate: null, //筛选日期
      loading: true, //加载中
      page: 1,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles(1);
    this.loadChannels();
  },
  mounted() {},
  methods: {
    onSubmit() {},
    loadArticles(page = 1) {
      // 展示加载中
      this.loading = true;
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        // begin_pubdate: "2021-1-1",
        // end_pubdate: "2022-1-6",
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
      }).then((res) => {
        const { results, total_count: totalCount } = res.data.data;
        this.articles = results;
        this.totalCount = totalCount;

        // 关闭加载中
        this.loading = false;
      });
    },
    onCurrentChange(page) {
      this.loadArticles(page);
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        getArticleChannels;
        this.channels = res.data.data.channels;
      });
    },
    onDeleteArticle(articleId) {
      //删除调用
      this.$confirm("确认删除么?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteArticle(articleId).then((res) => {
            console.log(res);
            this.loadArticles(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 60px;
  background-size: cover;
}
</style>