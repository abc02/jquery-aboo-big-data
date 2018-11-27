WEB_PATH='/home/page/jquery-aboo-big-data-spa/'
# WEB_PATH_CLIENT='/home/wwwroot/vnshop/client'
WEB_USER='root'
WEB_USERGROUP='root'
# we can do 
echo "项目开始部署"
cd $WEB_PATH
# git reset --hard origin/release
# git clean -f
# 把项目拉取到最新
echo "项目切换至主分支..." 
git checkout master
echo "项目拉取到最新..." 
git pull
# echo "项目切换至主分支..." 
# git checkout master
# 安装项目依赖
# echo "项目安装依赖..."
# npm install
# # 切换到client里面
# # cd $WEB_PATH_CLIENT
# # 把vue项目编译
# echo "项目编译中..."
# npm run build
# chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
# echo "项目编辑完成."