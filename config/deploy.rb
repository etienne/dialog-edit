require 'dotenv/load'
require 'mina/git'
require 'mina/deploy'

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

set :application_name, 'dialog-edit'
set :domain, ENV['DOMAIN']
# set :clone_to, ENV['CLONE_TO'];
set :deploy_to, ENV['DEPLOY_TO']
set :repository, ENV['REPOSITORY']
set :branch, ENV['BRANCH']

# Optional settings:
set :user, ENV['SSH_USER']          # Username in the server to SSH to.
#   set :port, '30000'           # SSH port number.
#   set :forward_agent, true     # SSH forward_agent.

# shared dirs and files will be symlinked into the app-folder by the 'deploy:link_shared_paths' step.
# set :shared_dirs, fetch(:shared_dirs, []).push('out/data')
# set :shared_files, fetch(:shared_files, []).push('.env')

# This task is the environment that is loaded for all remote run commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  # If you're using rbenv, use this to load the rbenv environment.
  # Be sure to commit your .ruby-version or .rbenv-version to your repository.
  # invoke :'rbenv:load'

  # For those using RVM, use this to load an RVM version@gemset.
  # invoke :'rvm:use', 'ruby-1.9.3-p125@default'
end

# Put any custom commands you need to run at setup
# All paths in `shared_dirs` and `shared_paths` will be created on their own.
task :setup do
  # command %{rbenv install 2.3.0}
end

desc "Deploys the current version to the server."
task :deploy do
  # uncomment this line to make sure you pushed your local branch to the remote origin
  # invoke :'git:ensure_pushed'
  
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    command %{npm install}
    command %{npm run build}
    # command %{cp --parents api/index.php out/api/index.php}
    # run(:local) do
    #   command "scp -rp out #{fetch(:user)}@#{fetch(:domain)}:#{fetch(:current_path)}/out"
    # end
    
    invoke :'deploy:link_shared_paths'
    invoke :'deploy:cleanup'

    # on :launch do
    #   in_path(fetch(:current_path)) do
    #     command %{mkdir -p tmp/}
    #     command %{touch tmp/restart.txt}
    #   end
    # end
  end

  # you can use `run :local` to run tasks on local machine before of after the deploy scripts
  # run(:local){ say 'done' }
end

# For help in making your deploy script, see the Mina documentation:
#
#  - https://github.com/mina-deploy/mina/tree/master/docs
