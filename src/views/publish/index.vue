<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publish-form"
        :rules="formRules"
        :model="article"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            lang="zh"
            height="400"
            placeholder="请输入文章内容"
            v-model="article.content"
            :extensions="extensions"
          ></el-tiptap>
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article";

import {
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  ElementTiptap,
  TodoItem,
  TodoList,
  Fullscreen,
} from "element-tiptap";
import "element-tiptap/lib/index.css";
import { uploadImage } from "@/api/image";

export default {
  name: "PublishIndex",
  components: {
    "el-tiptap": ElementTiptap,
  },
  props: {},
  data() {
    return {
      channels: [],
      article: {
        title: "",
        content: "",
        cover: {
          type: 0,
          images: [],
        },
        channel_id: null,
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),

        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Image({
          uploadRequest(file) {
            const fd = new FormData();
            fd.append("image", file);
            // console.log(file);
            return uploadImage(fd).then((res) => {
              //   console.log(res);
              return res.data.data.url;
              //   return res.data.data.url;
            });
          },
        }),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
      ],
      formRules: {
        title: [
          {
            required: true,
            message: "请输入文章标题",
            trigger: "blur",
          },
          {
            min: 5,
            max: 30,
            message: "长度在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            validator(rule, value, callback) {
              // console.log("验证");
              if (value === "<p></p>") {
                callback(new Error("请输入文章内容"));
              } else {
                callback();
              }
            },
          },
          {
            required: true,
            message: "请输入文章内容",
            trigger: "blur",
          },
        ],
        channel_id: [
          {
            required: true,
            message: "请输入文章频道",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadChannels();
    // console.log("杀杀杀");
    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  mounted() {},
  methods: {
    onPublish(draft = false) {
      this.$refs["publish-form"].validate((valid) => {
        if (!valid) {
          return;
        }
        const articleId = this.$route.query.id;
        if (this.$route.query.id) {
          updateArticle(articleId, this.article, draft).then((res) => {
            console.log(res);
            this.$message({
              message: `${draft ? "存入草稿" : "发布"}成功`,

              type: "success",
            });
            this.$router.push("/article");
          });
        } else {
          addArticle(this.article, draft).then((res) => {
            // console.log(res);
            this.$message({
              message: `${draft ? "存入草稿" : "发布"}成功`,
              type: "success",
            });
            this.$router.push("/article");
          });
        }
      });
    },
    loadChannels() {
      getArticleChannels().then(({ data }) => {
        // console.log(res);
        this.channels = data.data.channels;
      });
    },
    loadArticle() {
      //   console.log(7878778);
      getArticle(this.$route.query.id).then((res) => {
        // console.log(res);
        this.article = res.data.data;
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>