import db from "../config/dbconfig.js";

export const generateRoutineTasks = async () => {
  try {
    // 1. Get all routine task configs with task category and owner info
    const [configs] = await db.query(`
      SELECT rtc.*, tc.owner_id
      FROM routine_task_config rtc
      JOIN task_category tc ON rtc.task_category_id = tc.id
    `);

    const now = new Date();

    for (const config of configs) {
      const {
        id,
        task_category_id,
        recurrence_interval_hours,
        assigned_to,
        last_generated_at,
        completion_window_minutes,
        owner_id
      } = config;

      const lastGenerated = last_generated_at ? new Date(last_generated_at) : new Date(0);
      const nextGenerationTime = new Date(lastGenerated.getTime() + recurrence_interval_hours * 60 * 60 * 1000);

      if (now >= nextGenerationTime) {
        // 2. Get all ponds for this owner
        const [ponds] = await db.query(`
          SELECT p.id FROM pond p
          JOIN farm f ON p.farm_id = f.id
          WHERE f.owner_id = ?
        `, [owner_id]);

        if (ponds.length === 0) {
          console.log(`⚠️ No ponds found for owner_id ${owner_id}. Skipping task category ${task_category_id}`);
          continue;
        }

        // 3. Generate tasks for each pond
        for (const pond of ponds) {
          const dueDate = new Date(now.getTime() + completion_window_minutes * 60 * 1000);

          await db.query(`
            INSERT INTO task (pond_id, tk_id, assigned_to, assigned_by, description, status, due_date)
            VALUES (?, ?, ?, NULL, ?, 'Pending', ?)
          `, [
            pond.id,
            task_category_id,
            assigned_to,
            'Routine Task - Generated automatically',
            dueDate
          ]);

          console.log(`✅ Task created for pond ID ${pond.id} under category ID ${task_category_id}`);
        }

        // 4. Update last_generated_at
        await db.query(`
          UPDATE routine_task_config
          SET last_generated_at = ?
          WHERE id = ?
        `, [now, id]);

        console.log(`🔁 Updated last_generated_at for routine config ID ${id}`);
      } else {
        console.log(`⏳ Not time yet for routine config ID ${id}`);
      }
    }
  } catch (err) {
    console.error("❌ Error generating routine tasks:", err);
  }
};
