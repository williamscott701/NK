#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Script to check which Bible concepts are still pending in bible-concepts-content.md
 * Compares concepts defined in bible-concepts.json with those that have content in the markdown file
 * 
 * Usage: node scripts/check-pending-concepts.js [output-file]
 * If output-file is provided, results will be saved to that file
 */

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        process.exit(1);
    }
}

function loadMarkdownFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading markdown file: ${error.message}`);
        process.exit(1);
    }
}

function extractConceptIdsFromMarkdown(content) {
    const conceptHeaders = content.match(/^## .+$/gm) || [];
    const conceptIds = [];
    
    conceptHeaders.forEach(header => {
        // Look for the ID line that follows each header
        const lines = content.split('\n');
        const headerIndex = lines.findIndex(line => line === header);
        
        if (headerIndex !== -1) {
            // Look for the ID line in the next few lines
            for (let i = headerIndex + 1; i < Math.min(headerIndex + 10, lines.length); i++) {
                const line = lines[i];
                if (line.includes('**ID**:')) {
                    const idMatch = line.match(/\*\*ID\*\*:\s*([^\s]+)/);
                    if (idMatch) {
                        conceptIds.push(idMatch[1]);
                    }
                    break;
                }
            }
        }
    });
    
    return conceptIds;
}

function generateReport(concepts, completedConceptIds, pendingConcepts, completedConcepts) {
    let report = '';
    
    report += '# Bible Concepts Progress Report\n\n';
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    report += `## Summary\n\n`;
    report += `- **Total concepts defined**: ${concepts.length}\n`;
    report += `- **Concepts with content**: ${completedConceptIds.length}\n`;
    report += `- **Concepts pending**: ${pendingConcepts.length}\n`;
    report += `- **Completion status**: ${((completedConcepts.length / concepts.length) * 100).toFixed(1)}%\n\n`;
    
    if (completedConcepts.length > 0) {
        report += `## ✅ Completed Concepts\n\n`;
        completedConcepts.forEach(concept => {
            report += `### ${concept.title}\n`;
            report += `- **ID**: ${concept.id}\n`;
            report += `- **Category**: ${concept.category}\n`;
            report += `- **Significance**: ${concept.significance}\n`;
            report += `- **Key Themes**: ${concept.keyThemes.join(', ')}\n\n`;
        });
    }
    
    if (pendingConcepts.length > 0) {
        report += `## ⏳ Pending Concepts\n\n`;
        
        // Group by significance (High first)
        const highSignificance = pendingConcepts.filter(c => c.significance === 'High');
        const mediumSignificance = pendingConcepts.filter(c => c.significance === 'Medium');
        const lowSignificance = pendingConcepts.filter(c => c.significance === 'Low');
        
        if (highSignificance.length > 0) {
            report += `### 🔴 High Significance (${highSignificance.length})\n\n`;
            highSignificance.forEach(concept => {
                report += `- **${concept.title}** (${concept.id})\n`;
                report += `  - Category: ${concept.category}\n`;
                report += `  - Key Themes: ${concept.keyThemes.join(', ')}\n\n`;
            });
        }
        
        if (mediumSignificance.length > 0) {
            report += `### 🟡 Medium Significance (${mediumSignificance.length})\n\n`;
            mediumSignificance.forEach(concept => {
                report += `- **${concept.title}** (${concept.id})\n`;
                report += `  - Category: ${concept.category}\n`;
                report += `  - Key Themes: ${concept.keyThemes.join(', ')}\n\n`;
            });
        }
        
        if (lowSignificance.length > 0) {
            report += `### 🟢 Low Significance (${lowSignificance.length})\n\n`;
            lowSignificance.forEach(concept => {
                report += `- **${concept.title}** (${concept.id})\n`;
                report += `  - Category: ${concept.category}\n`;
                report += `  - Key Themes: ${concept.keyThemes.join(', ')}\n\n`;
            });
        }
        
        // Summary by category
        const categorySummary = {};
        pendingConcepts.forEach(concept => {
            if (!categorySummary[concept.category]) {
                categorySummary[concept.category] = [];
            }
            categorySummary[concept.category].push(concept.title);
        });
        
        report += `## 📋 Pending by Category\n\n`;
        Object.entries(categorySummary).forEach(([category, titles]) => {
            report += `### ${category} (${titles.length})\n`;
            titles.forEach(title => report += `- ${title}\n`);
            report += `\n`;
        });
    }
    
    report += `## 💡 Next Steps\n\n`;
    report += `1. **Prioritize High Significance concepts** - These have the most theological impact\n`;
    report += `2. **Work by category** - Complete one category at a time for consistency\n`;
    report += `3. **Use existing content as template** - Follow the structure of completed concepts\n`;
    report += `4. **Focus on core themes** - Ensure each concept covers Biblical Context, Theological Depth, and Practical Applications\n\n`;
    
    return report;
}

function main() {
    const baseDir = path.join(__dirname, '..');
    const jsonPath = path.join(baseDir, 'src', 'data', 'bible-concepts.json');
    const markdownPath = path.join(baseDir, 'src', 'data', 'bible-concepts-content.md');
    
    // Check if output file is specified
    const outputFile = process.argv[2];
    
    console.log('🔍 Checking pending Bible concepts...\n');
    
    // Load the JSON file
    const jsonData = loadJsonFile(jsonPath);
    const concepts = jsonData.concepts || [];
    
    // Load the markdown file
    const markdownContent = loadMarkdownFile(markdownPath);
    
    // Extract concept IDs from markdown
    const completedConceptIds = extractConceptIdsFromMarkdown(markdownContent);
    
    console.log(`📊 Total concepts defined: ${concepts.length}`);
    console.log(`✅ Concepts with content: ${completedConceptIds.length}`);
    console.log(`⏳ Concepts pending: ${concepts.length - completedConceptIds.length}\n`);
    
    // Find pending concepts
    const pendingConcepts = concepts.filter(concept => 
        !completedConceptIds.includes(concept.id)
    );
    
    // Find completed concepts
    const completedConcepts = concepts.filter(concept => 
        completedConceptIds.includes(concept.id)
    );
    
    if (completedConcepts.length > 0) {
        console.log('✅ COMPLETED CONCEPTS:');
        completedConcepts.forEach(concept => {
            console.log(`   • ${concept.title} (${concept.id})`);
        });
        console.log();
    }
    
    if (pendingConcepts.length > 0) {
        console.log('⏳ PENDING CONCEPTS:');
        pendingConcepts.forEach(concept => {
            console.log(`   • ${concept.title} (${concept.id})`);
            console.log(`     Category: ${concept.category}`);
            console.log(`     Significance: ${concept.significance}`);
            console.log(`     Key Themes: ${concept.keyThemes.join(', ')}`);
            console.log();
        });
        
        // Generate a summary by category
        const categorySummary = {};
        pendingConcepts.forEach(concept => {
            if (!categorySummary[concept.category]) {
                categorySummary[concept.category] = [];
            }
            categorySummary[concept.category].push(concept.title);
        });
        
        console.log('📋 PENDING BY CATEGORY:');
        Object.entries(categorySummary).forEach(([category, titles]) => {
            console.log(`   ${category}: ${titles.length} concepts`);
            titles.forEach(title => console.log(`     • ${title}`));
            console.log();
        });
        
        // Generate a summary by significance
        const significanceSummary = {};
        pendingConcepts.forEach(concept => {
            if (!significanceSummary[concept.significance]) {
                significanceSummary[concept.significance] = [];
            }
            significanceSummary[concept.significance].push(concept.title);
        });
        
        console.log('🎯 PENDING BY SIGNIFICANCE:');
        Object.entries(significanceSummary).forEach(([significance, titles]) => {
            console.log(`   ${significance}: ${titles.length} concepts`);
            titles.forEach(title => console.log(`     • ${title}`));
            console.log();
        });
    }
    
    // Calculate completion percentage
    const completionPercentage = ((completedConcepts.length / concepts.length) * 100).toFixed(1);
    console.log(`📈 COMPLETION STATUS: ${completionPercentage}% (${completedConcepts.length}/${concepts.length})`);
    
    if (pendingConcepts.length > 0) {
        console.log('\n💡 NEXT STEPS:');
        console.log('   Consider working on concepts with "High" significance first');
        console.log('   Focus on one category at a time for consistency');
        console.log('   Use the existing content as a template for new concepts');
    }
    
    // Generate and optionally save detailed report
    if (outputFile) {
        try {
            const report = generateReport(concepts, completedConceptIds, pendingConcepts, completedConcepts);
            fs.writeFileSync(outputFile, report, 'utf8');
            console.log(`\n📄 Detailed report saved to: ${outputFile}`);
        } catch (error) {
            console.error(`Error saving report: ${error.message}`);
        }
    }
}

// Run the script
main();
