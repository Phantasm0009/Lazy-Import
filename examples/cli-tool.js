#!/usr/bin/env node

/**
 * CLI tool example showing lazy-import for command-line applications
 */
const lazy = require('lazy-import').default;

// Lazy load CLI dependencies with fallbacks
const loadChalk = lazy('chalk');
const loadInquirer = lazy('inquirer');
const loadFiglet = lazy('figlet');
const loadProgressBar = lazy('cli-progress');
const loadSpinner = lazy('ora');

class CLITool {
  constructor() {
    this.commands = {
      help: this.showHelp.bind(this),
      interactive: this.runInteractive.bind(this),
      banner: this.showBanner.bind(this),
      process: this.processFiles.bind(this),
      config: this.manageConfig.bind(this),
      demo: this.runDemo.bind(this)
    };
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    if (this.commands[command]) {
      await this.commands[command](args.slice(1));
    } else {
      console.error(`Unknown command: ${command}`);
      await this.showHelp();
      process.exit(1);
    }
  }

  async showHelp() {
    console.log(`
Usage: cli-tool <command> [options]

Commands:
  help        Show this help message
  interactive Run in interactive mode (requires inquirer)
  banner      Show ASCII banner (requires figlet)
  process     Process files (requires cli-progress, ora)
  config      Manage configuration (requires inquirer)
  demo        Run a simple demo without external dependencies

Examples:
  cli-tool demo
  cli-tool interactive
  cli-tool process --input ./files --output ./processed
  cli-tool config --set theme=dark

Note: Some commands require additional npm packages to be installed.
Run 'npm install' in the examples directory to install all dependencies.
`);
  }

  async runDemo() {
    console.log('🚀 Running simple demo without external dependencies...');
    
    // Use only Node.js built-in modules
    const loadPath = lazy('path');
    const loadOs = lazy('os');
    const loadUtil = lazy('util');
    
    console.log('\n📦 Loading Node.js built-in modules...');
    
    const modules = await lazy.all({
      path: 'path',
      os: 'os',
      util: 'util'
    });
    
    console.log('✅ Modules loaded successfully!');
    console.log('\n📊 System Information:');
    console.log(`Platform: ${modules.os.platform()}`);
    console.log(`Architecture: ${modules.os.arch()}`);
    console.log(`CPU Count: ${modules.os.cpus().length}`);
    console.log(`Home Directory: ${modules.os.homedir()}`);
    console.log(`Current Directory: ${modules.path.resolve('.')}`);
    
    console.log('\n🔗 Path Operations:');
    const joined = modules.path.join('users', 'documents', 'projects');
    console.log(`Joined Path: ${joined}`);
    console.log(`Basename: ${modules.path.basename(joined)}`);
    console.log(`Dirname: ${modules.path.dirname(joined)}`);
    
    console.log('\n🔍 Object Inspection:');
    const testObj = { name: 'lazy-import', version: '0.1.0', features: ['caching', 'preloading'] };
    console.log(modules.util.inspect(testObj, { colors: false, depth: 2 }));
    
    console.log('\n✨ Demo completed successfully!');
  }

  async showBanner() {
    try {
      console.log('Loading banner...');
      const figlet = await loadFiglet();
      const chalk = await loadChalk();
      
      const banner = figlet.default.textSync('CLI Tool', {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      });
      
      console.log(chalk.default.cyan(banner));
      console.log(chalk.default.yellow('Welcome to the amazing CLI tool!'));
    } catch (error) {
      console.log('❌ Could not load banner dependencies (figlet, chalk)');
      console.log('💡 Run: npm install figlet chalk');
      console.log('\n📝 CLI Tool - Welcome!');
      console.log('🎯 This is a fallback banner when dependencies are missing.');
    }
  }

  async runInteractive() {
    try {
      console.log('Loading interactive mode...');
      const inquirer = await loadInquirer();
      const chalk = await loadChalk();
      
      console.log(chalk.default.blue('🚀 Interactive Mode Started'));
      
      const answers = await inquirer.default.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'Process files',
            'Show banner',
            'Manage config',
            'Run demo',
            'Exit'
          ]
        }
      ]);
      
      switch (answers.action) {
        case 'Process files':
          await this.processFiles();
          break;
        case 'Show banner':
          await this.showBanner();
          break;
        case 'Manage config':
          await this.manageConfig();
          break;
        case 'Run demo':
          await this.runDemo();
          break;
        case 'Exit':
          console.log(chalk.default.green('Goodbye!'));
          return;
      }
      
      // Ask if they want to continue
      const { continue: shouldContinue } = await inquirer.default.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Do you want to perform another action?',
          default: true
        }
      ]);
      
      if (shouldContinue) {
        await this.runInteractive();
      }
      
    } catch (error) {
      console.log('❌ Could not load interactive mode dependencies (inquirer, chalk)');
      console.log('💡 Run: npm install inquirer chalk');
      console.log('\n🎯 Try running: cli-tool demo');
      console.log('   This command works without external dependencies.');
    }
  }

  async processFiles(args = []) {
    try {
      console.log('Loading file processing tools...');
      
      // Load multiple tools at once
      const tools = await lazy.all({
        chalk: 'chalk',
        progressBar: 'cli-progress',
        spinner: 'ora'
      });
      
      const files = args.length > 0 ? args : ['file1.txt', 'file2.txt', 'file3.txt'];
      
      console.log(tools.chalk.default.blue(`Processing ${files.length} files...`));
      
      // Show spinner while setting up
      const spinner = tools.spinner.default('Setting up processing...').start();
      await this.delay(1000);
      spinner.succeed('Setup complete');
      
      // Show progress bar for processing
      const progressBar = new tools.progressBar.default.SingleBar({
        format: 'Processing |{bar}| {percentage}% | {value}/{total} Files | {filename}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });
      
      progressBar.start(files.length, 0);
      
      for (let i = 0; i < files.length; i++) {
        progressBar.update(i + 1, { filename: files[i] });
        await this.delay(500); // Simulate processing
      }
      
      progressBar.stop();
      console.log(tools.chalk.default.green('✅ All files processed successfully!'));
      
    } catch (error) {
      console.log('❌ Could not load file processing dependencies (chalk, cli-progress, ora)');
      console.log('💡 Run: npm install chalk cli-progress ora');
      console.log('\n🎯 Simulating file processing without dependencies...');
      
      const files = args.length > 0 ? args : ['file1.txt', 'file2.txt', 'file3.txt'];
      console.log(`📁 Processing ${files.length} files...`);
      
      for (let i = 0; i < files.length; i++) {
        console.log(`⏳ Processing ${files[i]}... (${i + 1}/${files.length})`);
        await this.delay(300);
      }
      
      console.log('✅ All files processed successfully!');
    }
  }

  async manageConfig(args = []) {
    try {
      console.log('Loading configuration tools...');
      const { chalk, inquirer } = await lazy.all({
        chalk: 'chalk',
        inquirer: 'inquirer'
      });
      
      const action = args[0];
      
      if (action === '--set') {
        const setting = args[1];
        if (setting) {
          const [key, value] = setting.split('=');
          console.log(chalk.default.green(`✅ Set ${key} = ${value}`));
          return;
        }
      }
      
      // Interactive config management
      const { configAction } = await inquirer.default.prompt([
        {
          type: 'list',
          name: 'configAction',
          message: 'Configuration action:',
          choices: [
            'View current config',
            'Change theme',
            'Set output directory',
            'Reset to defaults'
          ]
        }
      ]);
      
      switch (configAction) {
        case 'View current config':
          console.log(chalk.default.blue('Current Configuration:'));
          console.log('Theme: dark');
          console.log('Output: ./output');
          console.log('Debug: false');
          break;
          
        case 'Change theme':
          const { theme } = await inquirer.default.prompt([
            {
              type: 'list',
              name: 'theme',
              message: 'Select theme:',
              choices: ['light', 'dark', 'auto']
            }
          ]);
          console.log(chalk.default.green(`✅ Theme changed to: ${theme}`));
          break;
          
        case 'Set output directory':
          const { outputDir } = await inquirer.default.prompt([
            {
              type: 'input',
              name: 'outputDir',
              message: 'Output directory:',
              default: './output'
            }
          ]);
          console.log(chalk.default.green(`✅ Output directory set to: ${outputDir}`));
          break;
          
        case 'Reset to defaults':
          console.log(chalk.default.yellow('⚠️  Configuration reset to defaults'));
          break;
      }
      
    } catch (error) {
      console.log('❌ Could not load configuration dependencies (chalk, inquirer)');
      console.log('💡 Run: npm install chalk inquirer');
      console.log('\n⚙️  Simulating configuration management...');
      
      const action = args[0];
      
      if (action === '--set') {
        const setting = args[1];
        if (setting) {
          const [key, value] = setting.split('=');
          console.log(`✅ Set ${key} = ${value}`);
          return;
        }
      }
      
      console.log('📋 Current Configuration:');
      console.log('  Theme: dark');
      console.log('  Output: ./output');
      console.log('  Debug: false');
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
if (require.main === module) {
  const cli = new CLITool();
  cli.run().catch(error => {
    console.error('CLI tool failed:', error);
    process.exit(1);
  });
}

module.exports = CLITool;