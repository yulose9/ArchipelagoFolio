import { NextRequest, NextResponse } from 'next/server';
import { portfolioSections } from '../../../src/data/portfolio';

/**
 * GET /api/sections
 * Returns portfolio sections data for the application
 */
export async function GET(request: NextRequest) {
    try {
        // In a real application, this might fetch from a database
        // For now, we return the mock data
        const sections = portfolioSections.map((section: any) => ({
            id: section.id,
            title: section.title,
            content: section.content,
            order: section.order,
        }));

        return NextResponse.json({
            success: true,
            data: sections,
            total: sections.length,
        });
    } catch (error) {
        console.error('Error fetching sections:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch sections',
                message: 'An error occurred while retrieving portfolio sections',
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/sections
 * Create a new portfolio section (for future admin functionality)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { title, content } = body;
        if (!title || !content) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields',
                    message: 'Title and content are required',
                },
                { status: 400 }
            );
        }

        // In a real application, this would save to a database
        const newSection = {
            id: `section_${Date.now()}`,
            title,
            content,
            order: portfolioSections.length + 1,
        };

        return NextResponse.json({
            success: true,
            data: newSection,
            message: 'Section created successfully',
        });
    } catch (error) {
        console.error('Error creating section:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create section',
                message: 'An error occurred while creating the section',
            },
            { status: 500 }
        );
    }
}