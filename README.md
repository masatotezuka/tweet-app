# tweet-app


## 1. レポジトリをローカルにクローンする.

`git clone https://github.com/masatotezuka/Login-function-express.git`

## 2 npm のインストール

`npm ci`

## 3. PostgreSQL の操作（コマンドライン）
-  インストール  
`brew install postgresql`
- 起動  
`brew services start postgresql`
- DB作成  
`psql postgres -c "create user my_dev"`  
`psql postgres -c "create database tweet_app_development owner my_dev"`

## 4. DB マイグレーション

`npx sequelize-cli db:migrate`

## 5. サーバー起動

`npm start`
